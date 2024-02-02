<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Hash;

/**
 * SHA-256 algorithm identifier.
 *
 * @see http://oid-info.com/get/2.16.840.1.101.3.4.2.1
 * @see https://tools.ietf.org/html/rfc4055#section-2.1
 * @see https://tools.ietf.org/html/rfc5754#section-2.2
 */
class SHA256AlgorithmIdentifier extends SHA2AlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_SHA256;
        parent::__construct();
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'sha256';
    }
}
