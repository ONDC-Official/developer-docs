<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1\AttributeValue;

use Sop\X501\ASN1\AttributeType;
use Sop\X501\ASN1\AttributeValue\Feature\DirectoryString;

/**
 * 'description' attribute value.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x520/2012/SelectedAttributeTypes.html#SelectedAttributeTypes.description
 */
class DescriptionValue extends DirectoryString
{
    /**
     * Constructor.
     *
     * @param string $value      String value
     * @param int    $string_tag Syntax choice
     */
    public function __construct(string $value,
        int $string_tag = DirectoryString::UTF8)
    {
        $this->_oid = AttributeType::OID_DESCRIPTION;
        parent::__construct($value, $string_tag);
    }
}
