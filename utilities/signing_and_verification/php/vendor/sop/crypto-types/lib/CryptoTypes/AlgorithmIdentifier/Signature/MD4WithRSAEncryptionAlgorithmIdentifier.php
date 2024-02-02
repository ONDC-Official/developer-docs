<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Signature;

/**
 * RSA with MD4 signature algorithm identifier.
 *
 * @see https://tools.ietf.org/html/rfc2313#section-11
 */
class MD4WithRSAEncryptionAlgorithmIdentifier extends RFC3279RSASignatureAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_MD4_WITH_RSA_ENCRYPTION;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'md4withRSAEncryption';
    }
}
