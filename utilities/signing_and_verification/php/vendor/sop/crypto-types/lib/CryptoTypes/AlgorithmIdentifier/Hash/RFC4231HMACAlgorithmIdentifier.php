<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Hash;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\NullType;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\HashAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\PRFAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/**
 * Base class for HMAC algorithm identifiers specified in RFC 4231.
 *
 * @see https://tools.ietf.org/html/rfc4231#section-3.1
 */
abstract class RFC4231HMACAlgorithmIdentifier extends SpecificAlgorithmIdentifier implements HashAlgorithmIdentifier, PRFAlgorithmIdentifier
{
    /**
     * Parameters stored for re-encoding.
     *
     * @var null|NullType
     */
    protected $_params;

    /**
     * {@inheritdoc}
     *
     * @return self
     */
    public static function fromASN1Params(
        ?UnspecifiedType $params = null): SpecificAlgorithmIdentifier
    {
        /*
         * RFC 4231 states that the "parameter" component SHOULD be present
         * but have type NULL.
         */
        $obj = new static();
        if (isset($params)) {
            $obj->_params = $params->asNull();
        }
        return $obj;
    }

    /**
     * {@inheritdoc}
     *
     * @return null|NullType
     */
    protected function _paramsASN1(): ?Element
    {
        return $this->_params;
    }
}
