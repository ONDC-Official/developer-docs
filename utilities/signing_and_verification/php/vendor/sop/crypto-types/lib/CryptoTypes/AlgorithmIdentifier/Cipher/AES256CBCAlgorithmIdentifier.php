<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Cipher;

/**
 * Algorithm identifier for AES with 256-bit key in CBC mode.
 *
 * @see https://tools.ietf.org/html/rfc3565.html#section-4.1
 * @see http://www.alvestrand.no/objectid/2.16.840.1.101.3.4.1.42.html
 * @see http://www.oid-info.com/get/2.16.840.1.101.3.4.1.42
 */
class AES256CBCAlgorithmIdentifier extends AESCBCAlgorithmIdentifier
{
    /**
     * Constructor.
     *
     * @param null|string $iv Initialization vector
     */
    public function __construct(?string $iv = null)
    {
        $this->_oid = self::OID_AES_256_CBC;
        parent::__construct($iv);
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'aes256-CBC';
    }

    /**
     * {@inheritdoc}
     */
    public function keySize(): int
    {
        return 32;
    }
}
