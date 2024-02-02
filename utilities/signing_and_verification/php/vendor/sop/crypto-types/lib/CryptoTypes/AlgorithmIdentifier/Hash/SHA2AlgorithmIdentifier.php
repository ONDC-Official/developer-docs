<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Hash;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\NullType;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\HashAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
From RFC 5754 - 2. Message Digest Algorithms

    The AlgorithmIdentifier parameters field is OPTIONAL.
    Implementations MUST accept SHA2 AlgorithmIdentifiers with absent
    parameters.  Implementations MUST accept SHA2 AlgorithmIdentifiers
    with NULL parameters.  Implementations MUST generate SHA2
    AlgorithmIdentifiers with absent parameters.
*/

/**
 * Base class for SHA2 algorithm identifiers.
 *
 * @see https://tools.ietf.org/html/rfc4055#section-2.1
 * @see https://tools.ietf.org/html/rfc5754#section-2
 */
abstract class SHA2AlgorithmIdentifier extends SpecificAlgorithmIdentifier implements HashAlgorithmIdentifier
{
    /**
     * Parameters.
     *
     * @var null|NullType
     */
    protected $_params;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->_params = null;
    }

    /**
     * {@inheritdoc}
     *
     * @return self
     */
    public static function fromASN1Params(
        ?UnspecifiedType $params = null): SpecificAlgorithmIdentifier
    {
        $obj = new static();
        // if parameters field is present, it must be null type
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
