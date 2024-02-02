<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410\Curve25519;

use Sop\CryptoTypes\Asymmetric\RFC8410\RFC8410PublicKey;

/**
 * Implements an intermediary object to store a public key using Curve25519.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
abstract class Curve25519PublicKey extends RFC8410PublicKey
{
    /**
     * Constructor.
     *
     * @param string $public_key Public key data
     */
    public function __construct(string $public_key)
    {
        if (32 !== strlen($public_key)) {
            throw new \UnexpectedValueException(
                'Curve25519 public key must be exactly 32 bytes.');
        }
        parent::__construct($public_key);
    }
}
