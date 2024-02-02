# CryptoTypes

[![Build Status](https://travis-ci.com/sop/crypto-types.svg?branch=master)](https://travis-ci.com/sop/crypto-types)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/sop/crypto-types/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/sop/crypto-types/?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/sop/crypto-types/badge.svg?branch=master)](https://coveralls.io/github/sop/crypto-types?branch=master)
[![License](https://poser.pugx.org/sop/crypto-types/license)](https://github.com/sop/crypto-types/blob/master/LICENSE)

A PHP library of various ASN.1 types for cryptographic applications.

## Requirements

- PHP >=7.2
- gmp
- [sop/asn1](https://github.com/sop/asn1)
- [sop/crypto-encoding](https://github.com/sop/crypto-encoding)
- [sop/x501](https://github.com/sop/x501)

## Features

- Asymmetric keys
  - [`RSAPrivateKey`](https://tools.ietf.org/html/rfc2437#section-11.1.2),
    [`RSAPublicKey`](https://tools.ietf.org/html/rfc2437#section-11.1.1)
  - [`ECPrivateKey`](https://tools.ietf.org/html/rfc5915#section-3),
    [`ECPublicKey`](https://tools.ietf.org/html/rfc5480#section-2.2)
  - [`PrivateKeyInfo`](https://tools.ietf.org/html/rfc5208#section-5)
    ([PKCS #8](https://tools.ietf.org/html/rfc5208))
  - [`SubjectPublicKeyInfo`](https://tools.ietf.org/html/rfc5280#section-4.1)
    ([X.509](https://tools.ietf.org/html/rfc5280))
- [RSA](https://tools.ietf.org/html/rfc2313#section-10) and
  [EC](https://tools.ietf.org/html/rfc3278#section-8.2) signature types
- Various `AlgorithmIdentifier` types and their OID's

## Installation

This library is available on
[Packagist](https://packagist.org/packages/sop/crypto-types).

    composer require sop/crypto-types

## License

This project is licensed under the MIT License.
