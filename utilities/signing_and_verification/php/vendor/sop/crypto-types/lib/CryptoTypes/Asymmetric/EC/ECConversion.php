<?php

declare(strict_types = 1);

namespace Sop\CryptoTypes\Asymmetric\EC;

use Sop\ASN1\Type\Primitive\BitString;
use Sop\ASN1\Type\Primitive\Integer;
use Sop\ASN1\Type\Primitive\OctetString;

/**
 * Implements data type conversions from SEC 1: Elliptic Curve Cryptography.
 *
 * @see http://www.secg.org/sec1-v2.pdf
 */
class ECConversion
{
    /**
     * Perform Bit-String-to-Octet-String Conversion.
     *
     * Defined in SEC 1 section 2.3.1.
     *
     * @throws \RuntimeException
     */
    public static function bitStringToOctetString(BitString $bs): OctetString
    {
        $str = $bs->string();
        if ($bs->unusedBits()) {
            // @todo pad string
            throw new \RuntimeException('Unaligned bitstrings to supported');
        }
        return new OctetString($str);
    }

    /**
     * Perform Octet-String-to-Bit-String Conversion.
     *
     * Defined in SEC 1 section 2.3.2.
     */
    public static function octetStringToBitString(OctetString $os): BitString
    {
        return new BitString($os->string());
    }

    /**
     * Perform Integer-to-Octet-String Conversion.
     *
     * Defined in SEC 1 section 2.3.7.
     *
     * @param int      $num
     * @param null|int $mlen Optional desired output length
     *
     * @throws \UnexpectedValueException
     */
    public static function integerToOctetString(Integer $num, ?int $mlen = null): OctetString
    {
        $gmp = gmp_init($num->number(), 10);
        $str = gmp_export($gmp, 1, GMP_MSW_FIRST | GMP_BIG_ENDIAN);
        if (null !== $mlen) {
            $len = strlen($str);
            if ($len > $mlen) {
                throw new \RangeException('Number is too large.');
            }
            // pad with zeroes
            if ($len < $mlen) {
                $str = str_repeat("\0", $mlen - $len) . $str;
            }
        }
        return new OctetString($str);
    }

    /**
     * Perform Octet-String-to-Integer Conversion.
     *
     * Defined in SEC 1 section 2.3.8.
     *
     * @return int
     */
    public static function octetStringToInteger(OctetString $os): Integer
    {
        $num = gmp_import($os->string(), 1, GMP_MSW_FIRST | GMP_BIG_ENDIAN);
        assert($num instanceof \GMP, new \RuntimeException('gmp_import() failed.'));
        return new Integer(gmp_strval($num, 10));
    }

    /**
     * Convert a base-10 number to octets.
     *
     * This is a convenicence method for integer <-> octet string conversion
     * without the need for external ASN.1 dependencies.
     *
     * @param int|string $num  Number in base-10
     * @param null|int   $mlen Optional desired output length
     */
    public static function numberToOctets($num, ?int $mlen = null): string
    {
        return self::integerToOctetString(new Integer($num), $mlen)->string();
    }

    /**
     * Convert octets to a base-10 number.
     *
     * This is a convenicence method for integer <-> octet string conversion
     * without the need for external ASN.1 dependencies.
     *
     * @return string Number in base-10
     */
    public static function octetsToNumber(string $str): string
    {
        return self::octetStringToInteger(new OctetString($str))->number();
    }
}
