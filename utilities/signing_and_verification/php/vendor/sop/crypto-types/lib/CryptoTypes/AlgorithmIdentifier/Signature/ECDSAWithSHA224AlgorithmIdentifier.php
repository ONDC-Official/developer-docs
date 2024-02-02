<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Signature;

/**
 * ECDSA with SHA-224 signature algorithm identifier.
 *
 * @see https://tools.ietf.org/html/rfc5758#section-3.2
 */
class ECDSAWithSHA224AlgorithmIdentifier extends ECSignatureAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_ECDSA_WITH_SHA224;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'ecdsa-with-SHA224';
    }
}
