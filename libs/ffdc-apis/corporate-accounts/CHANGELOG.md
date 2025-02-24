# Changelog

<!-- TOC -->

- [Changelog](#changelog)
  - [0.4.0 (2021-09-27)](#040-2021-09-27)
    - [Features](#features)
  - [0.3.0 (2020-07-24)](#030-2020-07-24)
    - [Features](#features-1)
  - [0.2.1 (2020-06-19)](#021-2020-06-19)
    - [Bugfixes](#bugfixes)
  - [0.2.0 (2020-06-10)](#020-2020-06-10)
    - [Features](#features-2)
  - [0.1.1 (2020-05-19)](#011-2020-05-19)
    - [Bug fixes](#bug-fixes)

<!-- /TOC -->

## 0.4.0 (2021-09-27)

### Features

- Nest 8 compatible

## 0.3.0 (2020-07-24)

### Features

Compatible with `@ffdc/nestjs-oidc` 0.10.0 onwards

## 0.2.1 (2020-06-19)

### Bugfixes

Remove unused parameter `details` from `accountsBalance` query

## 0.2.0 (2020-06-10)

### Features

FFDC APIs root path is now configurable :

```
CorporateAccountsModule.forRoot({
  ffdcApi: 'https://api.fusionfabric.cloud'
})
```

## 0.1.1 (2020-05-19)

### Bug fixes

- Fix interfaces not being exported correctly
