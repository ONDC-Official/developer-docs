<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\EC;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\ASN1\Type\Primitive\Integer;
use Sop\ASN1\Type\Primitive\OctetString;
use Sop\CryptoEncoding\PEM;
use Sop\CryptoTypes\AlgorithmIdentifier\AlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Asymmetric\ECPublicKeyAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AlgorithmIdentifierType;
use Sop\CryptoTypes\Asymmetric\PublicKey;
use Sop\CryptoTypes\Asymmetric\PublicKeyInfo;

/**
 * Implements elliptic curve public key type as specified by RFC 5480.
 *
 * @see https://tools.ietf.org/html/rfc5480#section-2.2
 */
class ECPublicKey extends PublicKey
{
    /**
     * Elliptic curve public key.
     *
     * @var string
     */
    protected $_ecPoint;

    /**
     * Named curve OID.
     *
     * Named curve is not a part of ECPublicKey, but it's stored as a hint
     * for the purpose of PublicKeyInfo creation.
     *
     * @var null|string
     */
    protected $_namedCurve;

    /**
     * Constructor.
     *
     * @param string      $ec_point    ECPoint
     * @param null|string $named_curve Named curve OID
     *
     * @throws \InvalidArgumentException If ECPoint is invalid
     */
    public function __construct(string $ec_point, ?string $named_curve = null)
    {
        // first octet must be 0x04 for uncompressed form, and 0x02 or 0x03
        // for compressed form.
        if (!strlen($ec_point) || !in_array(ord($ec_point[0]), [2, 3, 4])) {
            throw new \InvalidArgumentException('Invalid ECPoint.');
        }
        $this->_ecPoint = $ec_point;
        $this->_namedCurve = $named_curve;
    }

    /**
     * Initialize from curve point coordinates.
     *
     * @param int|string  $x           X coordinate as a base10 number
     * @param int|string  $y           Y coordinate as a base10 number
     * @param null|string $named_curve Named curve OID
     * @param null|int    $bits        Size of *p* in bits
     *
     * @return self
     */
    public static function fromCoordinates($x, $y,
        ?string $named_curve = null, ?int $bits = null): ECPublicKey
    {
        // if bitsize is not explicitly set, check from supported curves
        if (!isset($bits) && isset($named_curve)) {
            $bits = self::_curveSize($named_curve);
        }
        $mlen = null;
        if (isset($bits)) {
            $mlen = (int) ceil($bits / 8);
        }
        $x_os = ECConversion::integerToOctetString(new Integer($x), $mlen)->string();
        $y_os = ECConversion::integerToOctetString(new Integer($y), $mlen)->string();
        $ec_point = "\x4{$x_os}{$y_os}";
        return new self($ec_point, $named_curve);
    }

    /**
     * @see PublicKey::fromPEM()
     *
     * @throws \UnexpectedValueException
     *
     * @return self
     */
    public static function fromPEM(PEM $pem): ECPublicKey
    {
        if (PEM::TYPE_PUBLIC_KEY !== $pem->type()) {
            throw new \UnexpectedValueException('Not a public key.');
        }
        $pki = PublicKeyInfo::fromDER($pem->data());
        $algo = $pki->algorithmIdentifier();
        if (AlgorithmIdentifier::OID_EC_PUBLIC_KEY !== $algo->oid()
            || !($algo instanceof ECPublicKeyAlgorithmIdentifier)) {
            throw new \UnexpectedValueException('Not an elliptic curve key.');
        }
        // ECPoint is directly mapped into public key data
        return new self($pki->publicKeyData()->string(), $algo->namedCurve());
    }

    /**
     * Get ECPoint value.
     */
    public function ECPoint(): string
    {
        return $this->_ecPoint;
    }

    /**
     * Get curve point coordinates.
     *
     * @return string[] Tuple of X and Y coordinates as base-10 numbers
     */
    public function curvePoint(): array
    {
        return array_map(
            function ($str) {
                return ECConversion::octetsToNumber($str);
            }, $this->curvePointOctets());
    }

    /**
     * Get curve point coordinates in octet string representation.
     *
     * @return string[] tuple of X and Y field elements as a string
     */
    public function curvePointOctets(): array
    {
        if ($this->isCompressed()) {
            throw new \RuntimeException('EC point compression not supported.');
        }
        $str = substr($this->_ecPoint, 1);
        [$x, $y] = str_split($str, (int) floor(strlen($str) / 2));
        return [$x, $y];
    }

    /**
     * Whether ECPoint is in compressed form.
     */
    public function isCompressed(): bool
    {
        $c = ord($this->_ecPoint[0]);
        return 4 !== $c;
    }

    /**
     * Whether named curve is present.
     */
    public function hasNamedCurve(): bool
    {
        return isset($this->_namedCurve);
    }

    /**
     * Get named curve OID.
     *
     * @throws \LogicException
     */
    public function namedCurve(): string
    {
        if (!$this->hasNamedCurve()) {
            throw new \LogicException('namedCurve not set.');
        }
        return $this->_namedCurve;
    }

    /**
     * {@inheritdoc}
     */
    public function algorithmIdentifier(): AlgorithmIdentifierType
    {
        return new ECPublicKeyAlgorithmIdentifier($this->namedCurve());
    }

    /**
     * Generate ASN.1 element.
     */
    public function toASN1(): OctetString
    {
        return new OctetString($this->_ecPoint);
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
     *
     * @see https://tools.ietf.org/html/rfc5480#section-2.2
     */
    public function subjectPublicKey(): BitString
    {
        // ECPoint is directly mapped to subjectPublicKey
        return new BitString($this->_ecPoint);
    }

    /**
     * Get the curve size *p* in bits.
     *
     * @param string $oid Curve OID
     */
    private static function _curveSize(string $oid): ?int
    {
        if (!array_key_exists($oid, ECPublicKeyAlgorithmIdentifier::MAP_CURVE_TO_SIZE)) {
            return null;
        }
        return ECPublicKeyAlgorithmIdentifier::MAP_CURVE_TO_SIZE[$oid];
    }
}
