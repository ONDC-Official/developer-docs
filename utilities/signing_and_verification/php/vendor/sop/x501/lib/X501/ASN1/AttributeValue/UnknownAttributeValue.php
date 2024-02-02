<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\AttributeValue;

use Sop\ASN1\Element;
use Sop\X501\MatchingRule\BinaryMatch;
use Sop\X501\MatchingRule\MatchingRule;

/**
 * Class to hold ASN.1 structure of an unimplemented attribute value.
 */
class UnknownAttributeValue extends AttributeValue
{
    /**
     * ASN.1 element.
     *
     * @var Element
     */
    protected $_element;

    /**
     * Constructor.
     *
     * @param string  $oid
     * @param Element $el
     */
    public function __construct(string $oid, Element $el)
    {
        $this->_oid = $oid;
        $this->_element = $el;
    }

    /**
     * {@inheritdoc}
     */
    public function toASN1(): Element
    {
        return $this->_element;
    }

    /**
     * {@inheritdoc}
     */
    public function stringValue(): string
    {
        // return DER encoding as a hexstring
        return '#' . bin2hex($this->_element->toDER());
    }

    /**
     * {@inheritdoc}
     */
    public function equalityMatchingRule(): MatchingRule
    {
        return new BinaryMatch();
    }

    /**
     * {@inheritdoc}
     */
    public function rfc2253String(): string
    {
        return $this->stringValue();
    }

    /**
     * {@inheritdoc}
     */
    protected function _transcodedString(): string
    {
        return $this->stringValue();
    }
}
