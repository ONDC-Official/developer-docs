<?php

declare(strict_types = 1);

namespace Custom\AlgorithmIdentifier\Asymmetric;

/**
 * Algorithm identifier for the Diffie-Hellman operation with curve448.
 *
 * @see http://oid-info.com/get/1.3.101.111
 */
class X448AlgorithmIdentifier extends RFC8410XAlgorithmIdentifier
{
    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_oid = self::OID_X448;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'id-X448';
    }
}
