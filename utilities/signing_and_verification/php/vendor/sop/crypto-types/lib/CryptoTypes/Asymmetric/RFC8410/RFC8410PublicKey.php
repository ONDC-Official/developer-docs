<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\CryptoTypes\Asymmetric\PublicKey;

/**
 * Implements an intermediary object to store a public key using
 * Curve25519 or Curve448 as defined by RFC 8410.
 *
 * Public keys described in RFC 8410 may only be encoded as `SubjectPublicKeyInfo`.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
abstract class RFC8410PublicKey extends PublicKey
{
    /**
     * Public key data.
     *
     * @var string
     */
    protected $_publicKey;

    /**
     * Constructor.
     *
     * @param string $public_key Public key data
     */
    public function __construct(string $public_key)
    {
        $this->_publicKey = $public_key;
    }

    /**
     * {@inheritdoc}
     */
    public function toDER(): string
    {
        throw new \LogicException("RFC 8410 public key doesn't have a DER encoding.");
    }

    /**
     * {@inheritdoc}
     */
    public function subjectPublicKey(): BitString
    {
        return new BitString($this->_publicKey);
    }
}
