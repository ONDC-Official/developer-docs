<?php

declare(strict_types = 1);

namespace Custom\AlgorithmIdentifier\Asymmetric;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\ObjectIdentifier;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\AsymmetricCryptoAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
From RFC 5480 - 2.1.1.  Unrestricted Algorithm Identifier and Parameters:

The parameter for id-ecPublicKey is as follows and MUST always be
present:

  ECParameters ::= CHOICE {
    namedCurve         OBJECT IDENTIFIER
    -- implicitCurve   NULL
    -- specifiedCurve  SpecifiedECDomain
  }
*/

/**
 * Algorithm identifier for the elliptic curve public key.
 *
 * @see https://tools.ietf.org/html/rfc5480#section-2.1.1
 */
class ECPublicKeyAlgorithmIdentifier extends SpecificAlgorithmIdentifier implements AsymmetricCryptoAlgorithmIdentifier
{
    /**
     * prime192v1/secp192r1 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.1
     *
     * @var string
     */
    public const CURVE_PRIME192V1 = '1.2.840.10045.3.1.1';

    /**
     * prime192v2 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.2
     *
     * @var string
     */
    public const CURVE_PRIME192V2 = '1.2.840.10045.3.1.2';

    /**
     * prime192v3 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.3
     *
     * @var string
     */
    public const CURVE_PRIME192V3 = '1.2.840.10045.3.1.3';

    /**
     * prime239v1 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.4
     *
     * @var string
     */
    public const CURVE_PRIME239V1 = '1.2.840.10045.3.1.4';

    /**
     * prime239v2 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.5
     *
     * @var string
     */
    public const CURVE_PRIME239V2 = '1.2.840.10045.3.1.5';

    /**
     * prime239v3 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.6
     *
     * @var string
     */
    public const CURVE_PRIME239V3 = '1.2.840.10045.3.1.6';

    /**
     * prime256v1/secp256r1 curve OID.
     *
     * @see http://oid-info.com/get/1.2.840.10045.3.1.7
     *
     * @var string
     */
    public const CURVE_PRIME256V1 = '1.2.840.10045.3.1.7';

    /**
     * "SEC 2" recommended elliptic curve domain - secp112r1.
     *
     * @see http://www.oid-info.com/get/1.3.132.0.6
     *
     * @var string
     */
    public const CURVE_SECP112R1 = '1.3.132.0.6';

    /**
     * "SEC 2" recommended elliptic curve domain - secp112r2.
     *
     * @see http://oid-info.com/get/1.3.132.0.7
     *
     * @var string
     */
    public const CURVE_SECP112R2 = '1.3.132.0.7';

    /**
     * "SEC 2" recommended elliptic curve domain - secp128r1.
     *
     * @see http://oid-info.com/get/1.3.132.0.28
     *
     * @var string
     */
    public const CURVE_SECP128R1 = '1.3.132.0.28';

    /**
     * "SEC 2" recommended elliptic curve domain - secp128r2.
     *
     * @see http://oid-info.com/get/1.3.132.0.29
     *
     * @var string
     */
    public const CURVE_SECP128R2 = '1.3.132.0.29';

    /**
     * "SEC 2" recommended elliptic curve domain - secp160k1.
     *
     * @see http://oid-info.com/get/1.3.132.0.9
     *
     * @var string
     */
    public const CURVE_SECP160K1 = '1.3.132.0.9';

    /**
     * "SEC 2" recommended elliptic curve domain - secp160r1.
     *
     * @see http://oid-info.com/get/1.3.132.0.8
     *
     * @var string
     */
    public const CURVE_SECP160R1 = '1.3.132.0.8';

    /**
     * "SEC 2" recommended elliptic curve domain - secp160r2.
     *
     * @see http://oid-info.com/get/1.3.132.0.30
     *
     * @var string
     */
    public const CURVE_SECP160R2 = '1.3.132.0.30';

    /**
     * "SEC 2" recommended elliptic curve domain - secp192k1.
     *
     * @see http://oid-info.com/get/1.3.132.0.31
     *
     * @var string
     */
    public const CURVE_SECP192K1 = '1.3.132.0.31';

    /**
     * "SEC 2" recommended elliptic curve domain - secp224k1.
     *
     * @see http://oid-info.com/get/1.3.132.0.32
     *
     * @var string
     */
    public const CURVE_SECP224K1 = '1.3.132.0.32';

    /**
     * "SEC 2" recommended elliptic curve domain - secp224r1.
     *
     * @see http://oid-info.com/get/1.3.132.0.33
     *
     * @var string
     */
    public const CURVE_SECP224R1 = '1.3.132.0.33';

    /**
     * "SEC 2" recommended elliptic curve domain - secp256k1.
     *
     * @see http://oid-info.com/get/1.3.132.0.10
     *
     * @var string
     */
    public const CURVE_SECP256K1 = '1.3.132.0.10';

    /**
     * National Institute of Standards and Technology (NIST) 384-bit elliptic
     * curve.
     *
     * @see http://oid-info.com/get/1.3.132.0.34
     *
     * @var string
     */
    public const CURVE_SECP384R1 = '1.3.132.0.34';

    /**
     * National Institute of Standards and Technology (NIST) 512-bit elliptic
     * curve.
     *
     * @see http://oid-info.com/get/1.3.132.0.35
     *
     * @var string
     */
    public const CURVE_SECP521R1 = '1.3.132.0.35';

    /**
     * Mapping from curve OID to field bit size.
     *
     * @internal
     *
     * @var array
     */
    public const MAP_CURVE_TO_SIZE = [
        self::CURVE_PRIME192V1 => 192,
        self::CURVE_PRIME192V2 => 192,
        self::CURVE_PRIME192V3 => 192,
        self::CURVE_PRIME239V1 => 239,
        self::CURVE_PRIME239V2 => 239,
        self::CURVE_PRIME239V3 => 239,
        self::CURVE_PRIME256V1 => 256,
        self::CURVE_SECP112R1 => 112,
        self::CURVE_SECP112R2 => 112,
        self::CURVE_SECP128R1 => 128,
        self::CURVE_SECP128R2 => 128,
        self::CURVE_SECP160K1 => 160,
        self::CURVE_SECP160R1 => 160,
        self::CURVE_SECP160R2 => 160,
        self::CURVE_SECP192K1 => 192,
        self::CURVE_SECP224K1 => 224,
        self::CURVE_SECP224R1 => 224,
        self::CURVE_SECP256K1 => 256,
        self::CURVE_SECP384R1 => 384,
        self::CURVE_SECP521R1 => 521,
    ];

    /**
     * OID of the named curve.
     *
     * @var string
     */
    protected $_namedCurve;

    /**
     * Constructor.
     *
     * @param string $named_curve Curve identifier
     */
    public function __construct(string $named_curve)
    {
        $this->_oid = self::OID_EC_PUBLIC_KEY;
        $this->_namedCurve = $named_curve;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'ecPublicKey';
    }

    /**
     * {@inheritdoc}
     *
     * @return self
     */
    public static function fromASN1Params(
        ?UnspecifiedType $params = null): SpecificAlgorithmIdentifier
    {
        if (!isset($params)) {
            throw new \UnexpectedValueException('No parameters.');
        }
        $named_curve = $params->asObjectIdentifier()->oid();
        return new self($named_curve);
    }

    /**
     * Get OID of the named curve.
     */
    public function namedCurve(): string
    {
        return $this->_namedCurve;
    }

    /**
     * {@inheritdoc}
     *
     * @return ObjectIdentifier
     */
    protected function _paramsASN1(): ?Element
    {
        return new ObjectIdentifier($this->_namedCurve);
    }
}
