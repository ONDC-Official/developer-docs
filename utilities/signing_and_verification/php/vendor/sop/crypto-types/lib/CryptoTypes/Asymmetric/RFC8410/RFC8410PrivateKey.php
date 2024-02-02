<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\RFC8410;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\ASN1\Type\Primitive\OctetString;
use Sop\CryptoEncoding\PEM;
use Sop\CryptoTypes\Asymmetric\Attribute\OneAsymmetricKeyAttributes;
use Sop\CryptoTypes\Asymmetric\OneAsymmetricKey;
use Sop\CryptoTypes\Asymmetric\PrivateKey;

/**
 * Implements an intermediary object to store a private key using
 * Curve25519 or Curve448 as defined by RFC 8410.
 *
 * Private keys described in RFC 8410 may only be encoded as `OneAsymmetricKey`
 * and thus version and attributes are also stored in this type.
 *
 * @see https://tools.ietf.org/html/rfc8410
 */
abstract class RFC8410PrivateKey extends PrivateKey
{
    /**
     * Private key data.
     *
     * @var string
     */
    protected $_privateKeyData;

    /**
     * Public key data.
     *
     * @var null|string
     */
    protected $_publicKeyData;

    /**
     * Version for OneAsymmetricKey.
     *
     * @var int
     */
    protected $_version;

    /**
     * Attributes from OneAsymmetricKey.
     *
     * @var null|OneAsymmetricKeyAttributes
     */
    protected $_attributes;

    /**
     * Constructor.
     *
     * @param string      $private_key Private key data
     * @param null|string $public_key  Public key data
     */
    public function __construct(string $private_key, ?string $public_key = null)
    {
        $this->_privateKeyData = $private_key;
        $this->_publicKeyData = $public_key;
        $this->_version = OneAsymmetricKey::VERSION_2;
        $this->_attributes = null;
    }

    /**
     * Initialize from `CurvePrivateKey` OctetString.
     *
     * @param OctetString $str        Private key data wrapped into OctetString
     * @param null|string $public_key Optional public key data
     */
    public static function fromOctetString(OctetString $str,
        ?string $public_key = null): self
    {
        return new static($str->string(), $public_key);
    }

    /**
     * Get self with version number.
     */
    public function withVersion(int $version): self
    {
        $obj = clone $this;
        $obj->_version = $version;
        return $obj;
    }

    /**
     * Get self with attributes.
     */
    public function withAttributes(?OneAsymmetricKeyAttributes $attribs): self
    {
        $obj = clone $this;
        $obj->_attributes = $attribs;
        return $obj;
    }

    /**
     * {@inheritdoc}
     */
    public function privateKeyData(): string
    {
        return $this->_privateKeyData;
    }

    /**
     * Whether public key is set.
     */
    public function hasPublicKey(): bool
    {
        return isset($this->_publicKeyData);
    }

    /**
     * Generate ASN.1 structure.
     */
    public function toASN1(): OctetString
    {
        return new OctetString($this->_privateKeyData);
    }

    /**
     * {@inheritdoc}
     */
    public function toDER(): string
    {
        return $this->toASN1()->toDER();
    }

    /**
     * {@inheritdoc}
     */
    public function toPEM(): PEM
    {
        $pub = $this->_publicKeyData ?
            new BitString($this->_publicKeyData) : null;
        $pki = new OneAsymmetricKey($this->algorithmIdentifier(),
            $this->toDER(), $this->_attributes, $pub);
        return $pki->withVersion($this->_version)->toPEM();
    }
}
