<?php

declare(strict_types = 1);

namespace Custom\AlgorithmIdentifier\Asymmetric;

/**
 * Algorithm identifier for the Diffie-Hellman operation with curve25519.
 *
 * @see http://oid-info.com/get/1.3.101.110
 */
class X25519AlgorithmIdentifier extends RFC8410XAlgorithmIdentifier
{
    public const OID_X25519 = '1.3.101.110';

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_X25519;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'id-X25519';
    }
}
