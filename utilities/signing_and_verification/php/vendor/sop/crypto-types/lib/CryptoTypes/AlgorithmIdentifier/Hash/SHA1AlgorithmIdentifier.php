<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier\Hash;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\NullType;
use Sop\ASN1\Type\UnspecifiedType;
use Sop\CryptoTypes\AlgorithmIdentifier\Feature\HashAlgorithmIdentifier;
use Sop\CryptoTypes\AlgorithmIdentifier\SpecificAlgorithmIdentifier;

/*
From RFC 3370 - 2.1 SHA-1

    The AlgorithmIdentifier parameters field is OPTIONAL.  If present,
    the parameters field MUST contain a NULL.  Implementations MUST
    accept SHA-1 AlgorithmIdentifiers with absent parameters.
    Implementations MUST accept SHA-1 AlgorithmIdentifiers with NULL
    parameters.  Implementations SHOULD generate SHA-1
    AlgorithmIdentifiers with absent parameters.
*/

/**
 * SHA-1 algorithm identifier.
 *
 * @see http://oid-info.com/get/1.3.14.3.2.26
 * @see https://tools.ietf.org/html/rfc3370#section-2.1
 */
class SHA1AlgorithmIdentifier extends SpecificAlgorithmIdentifier implements HashAlgorithmIdentifier
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
        $this->_oid = self::OID_SHA1;
        $this->_params = null;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return 'sha1';
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
