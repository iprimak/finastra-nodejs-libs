import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import { createProxyServer } from 'http-proxy';
import * as queryString from 'querystring';
import { ProxyController } from './controllers';
import { ProxyModuleAsyncOptions, ProxyModuleOptions, ProxyModuleOptionsFactory } from './interfaces';
import { defaultProxyOptions, HTTP_PROXY, PROXY_MODULE_OPTIONS } from './proxy.constants';
import { ProxyService } from './services';
import { concatPath } from './utils';

const proxyFactory = {
  provide: HTTP_PROXY,
  useFactory: async (options: ProxyModuleOptions) => {
    const logger = new Logger('Proxy');
    const proxy = createProxyServer({
      ...defaultProxyOptions,
      ...options.config,
    });

    proxy.on('proxyReq', function (proxyReq, req, res, options) {
      const url = concatPath(proxyReq.getHeader('host'), req.url);
      logger.log(`Sending ${req.method} ${url}`);

      if (!req['body'] || !Object.keys(req['body']).length) {
        return;
      }

      const contentType = proxyReq.getHeader('Content-Type');
      let bodyData: string;

      if (contentType === 'application/json') {
        bodyData = JSON.stringify(req['body']);
      }

      if (contentType === 'application/x-www-form-urlencoded') {
        bodyData = queryString.stringify(req['body']);
      }

      if (bodyData) {
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    });

    proxy.on('proxyRes', function (proxyRes, req, res) {
      const url = concatPath(proxyRes['req'].getHeader('host'), req.url);
      logger.log(`Received ${req.method} ${url}`);
    });
    return proxy;
  },
  inject: [PROXY_MODULE_OPTIONS],
};

@Module({
  providers: [ProxyService, proxyFactory],
  controllers: [ProxyController],
})
export class ProxyModule {
  static forRoot(options: ProxyModuleOptions): DynamicModule {
    return {
      module: ProxyModule,
      providers: [
        {
          provide: PROXY_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }

  static forRootAsync(options: ProxyModuleAsyncOptions): DynamicModule {
    return {
      module: ProxyModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options)],
    };
  }

  private static createAsyncProviders(options: ProxyModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(options: ProxyModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: PROXY_MODULE_OPTIONS,
        useFactory: async (...args: any[]) => await options.useFactory(...args),
        inject: options.inject || [],
      };
    }
    return {
      provide: PROXY_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ProxyModuleOptionsFactory) => await optionsFactory.createModuleConfig(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
