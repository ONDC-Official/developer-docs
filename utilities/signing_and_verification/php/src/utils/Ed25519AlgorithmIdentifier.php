<?php

declare(strict_types = 1);

namespace Custom\AlgorithmIdentifier\Asymmetric;

use Custom\AlgorithmIdentifier\AlgorithmIdentifier;

/**
 * Algorithm identifier for the Edwards-curve Digital Signature Algorithm (EdDSA)
 * with curve25519.
 *
 * Same algorithm identifier is used for public and private keys as well as for
 * signatures.
 *
 * @see http://oid-info.com/get/1.3.101.112
 * @see https://tools.ietf.org/html/rfc8420#appendix-A.1
 */
class Ed25519AlgorithmIdentifier extends RFC8410EdAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_ED25519;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'id-Ed25519';
    }

    /**
     * {@inheritdoc}
     */
    public function supportsKeyAlgorithm(AlgorithmIdentifier $algo): bool
    {
        return self::OID_ED25519 === $algo->oid();
    }
}
