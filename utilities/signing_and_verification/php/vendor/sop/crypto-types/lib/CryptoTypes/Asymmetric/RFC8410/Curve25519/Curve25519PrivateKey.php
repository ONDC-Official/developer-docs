<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410\Curve25519;

use Sop\CryptoTypes\Asymmetric\RFC8410\RFC8410PrivateKey;

/**
 * Implements an intermediary object to store a private key using Curve25519.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
abstract class Curve25519PrivateKey extends RFC8410PrivateKey
{
    /**
     * Constructor.
     *
     * @param string      $private_key Private key data
     * @param null|string $public_key  Public key data
     */
    public function __construct(string $private_key, ?string $public_key = null)
    {
        if (32 !== strlen($private_key)) {
            throw new \UnexpectedValueException(
                'Curve25519 private key must be exactly 32 bytes.');
        }
        if (isset($public_key) && 32 !== strlen($public_key)) {
            throw new \UnexpectedValueException(
                'Curve25519 public key must be exactly 32 bytes.');
        }
        parent::__construct($private_key, $public_key);
    }
}
