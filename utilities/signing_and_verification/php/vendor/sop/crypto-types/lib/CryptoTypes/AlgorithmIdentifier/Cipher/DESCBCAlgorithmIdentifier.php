<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Cipher;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\OctetString;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
RFC 2898 defines parameters as follows:

{OCTET STRING (SIZE(8)) IDENTIFIED BY desCBC}
*/

/**
 * Algorithm identifier for DES cipher in CBC mode.
 *
 * @see http://www.alvestrand.no/objectid/1.3.14.3.2.7.html
 * @see http://www.oid-info.com/get/1.3.14.3.2.7
 * @see https://tools.ietf.org/html/rfc2898#appendix-C
 */
class DESCBCAlgorithmIdentifier extends BlockCipherAlgorithmIdentifier
{
    /**
     * Constructor.
     *
     * @param null|string $iv Initialization vector
     */
    public function __construct(?string $iv = null)
    {
        $this->_checkIVSize($iv);
        $this->_oid = self::OID_DES_CBC;
        $this->_initializationVector = $iv;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'desCBC';
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
        $iv = $params->asOctetString()->string();
        return new self($iv);
    }

    /**
     * {@inheritdoc}
     */
    public function blockSize(): int
    {
        return 8;
    }

    /**
     * {@inheritdoc}
     */
    public function keySize(): int
    {
        return 8;
    }

    /**
     * {@inheritdoc}
     */
    public function ivSize(): int
    {
        return 8;
    }

    /**
     * {@inheritdoc}
     *
     * @return OctetString
     */
    protected function _paramsASN1(): ?Element
    {
        if (!isset($this->_initializationVector)) {
            throw new \LogicException('IV not set.');
        }
        return new OctetString($this->_initializationVector);
    }
}
