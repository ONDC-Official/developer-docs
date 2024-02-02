<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Signature;

/**
 * RSA with SHA-512 signature algorithm identifier.
 *
 * @see https://tools.ietf.org/html/rfc4055#section-5
 */
class SHA512WithRSAEncryptionAlgorithmIdentifier extends RFC4055RSASignatureAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();
        $this->_oid = self::OID_SHA512_WITH_RSA_ENCRYPTION;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'sha512WithRSAEncryption';
    }
}
