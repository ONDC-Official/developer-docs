<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Signature;

/**
 * ECDSA with SHA-1 signature algorithm identifier.
 *
 * @see https://tools.ietf.org/html/rfc3279#section-2.2.3
 */
class ECDSAWithSHA1AlgorithmIdentifier extends ECSignatureAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_ECDSA_WITH_SHA1;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'ecdsa-with-SHA1';
    }
}
