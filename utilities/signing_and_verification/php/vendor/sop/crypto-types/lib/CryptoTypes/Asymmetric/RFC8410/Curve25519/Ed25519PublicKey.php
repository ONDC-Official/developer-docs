<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410\Curve25519;

use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\Ed25519AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;

/**
 * Implements an intermediary object to store Ed25519 public key.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
class Ed25519PublicKey extends Curve25519PublicKey
{
    /**
     * {@inheritdoc}
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return new Ed25519AlgorithmIdentifier();
    }
}
