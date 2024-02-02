<?php

declare(strict_types = 1);

namespace Sop\X501\MatchingRule;

use Sop\X501\StringPrep\StringPreparer;

/**
 * Base class for matching rules employing string preparement semantics.
 */
abstract class StringPrepMatchingRule extends MatchingRule
{
    /**
     * String preparer.
     *
     * @var StringPreparer
     */
    protected $_prep;

    /**
     * Constructor.
     *
     * @param StringPreparer $preparer
     */
    public function __construct(StringPreparer $preparer)
    {
        $this->_prep = $preparer;
    }

    /**
     * {@inheritdoc}
     */
    public function compare($assertion, $value): ?bool
    {
        $assertion = $this->_prep->prepare($assertion);
        $value = $this->_prep->prepare($value);
        return 0 === strcmp($assertion, $value);
    }
}
