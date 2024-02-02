<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\AlgorithmIdentifier;

use Sop\ASN1\Element;
use Sop\ASN1\Type\UnspecifiedType;

/**
 * Generic algorithm identifier to hold parameters as ASN.1 objects.
 */
class GenericAlgorithmIdentifier extends AlgorithmIdentifier
{
    /**
     * Parameters.
     *
     * @var null|UnspecifiedType
     */
    protected $_params;

    /**
     * Constructor.
     *
     * @param string               $oid    Algorithm OID
     * @param null|UnspecifiedType $params Parameters
     */
    public function __construct(string $oid, ?UnspecifiedType $params = null)
    {
        $this->_oid = $oid;
        $this->_params = $params;
    }

    /**
     * {@inheritdoc}
     */
    public function name(): string
    {
        return $this->_oid;
    }

    /**
     * Get parameters.
     */
    public function parameters(): ?UnspecifiedType
    {
        return $this->_params;
    }

    /**
     * {@inheritdoc}
     */
    protected function _paramsASN1(): ?Element
    {
        return $this->_params ? $this->_params->asElement() : null;
    }
}
