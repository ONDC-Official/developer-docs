<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Hash;

/**
 * HMAC with SHA-512 algorithm identifier.
 *
 * @see https://tools.ietf.org/html/rfc4231#section-3.1
 */
class HMACWithSHA512AlgorithmIdentifier extends RFC4231HMACAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_HMAC_WITH_SHA512;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'hmacWithSHA512';
    }
}
