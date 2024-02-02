<?php

declare(strict_types = 1);

namespace Sop\X501\ASN1;

use Sop\ASN1\Element;
use Sop\ASN1\Type\Primitive\ObjectIdentifier;
use Sop\ASN1\Type\Primitive\PrintableString;
use Sop\ASN1\Type\Primitive\UTF8String;
use Sop\ASN1\Type\StringType;

/**
 * Implements *AttributeType* ASN.1 type.
 *
 * @see https://www.itu.int/ITU-T/formal-language/itu-t/x/x501/2012/InformationFramework.html#InformationFramework.AttributeType
 */
class AttributeType
{
    // OID's from 2.5.4 arc
    const OID_OBJECT_CLASS = '2.5.4.0';
    const OID_ALIASED_ENTRY_NAME = '2.5.4.1';
    const OID_KNOWLEDGE_INFORMATION = '2.5.4.2';
    const OID_COMMON_NAME = '2.5.4.3';
    const OID_SURNAME = '2.5.4.4';
    const OID_SERIAL_NUMBER = '2.5.4.5';
    const OID_COUNTRY_NAME = '2.5.4.6';
    const OID_LOCALITY_NAME = '2.5.4.7';
    const OID_STATE_OR_PROVINCE_NAME = '2.5.4.8';
    const OID_STREET_ADDRESS = '2.5.4.9';
    const OID_ORGANIZATION_NAME = '2.5.4.10';
    const OID_ORGANIZATIONAL_UNIT_NAME = '2.5.4.11';
    const OID_TITLE = '2.5.4.12';
    const OID_DESCRIPTION = '2.5.4.13';
    const OID_SEARCH_GUIDE = '2.5.4.14';
    const OID_BUSINESS_CATEGORY = '2.5.4.15';
    const OID_POSTAL_ADDRESS = '2.5.4.16';
    const OID_POSTAL_CODE = '2.5.4.17';
    const OID_POST_OFFICE_BOX = '2.5.4.18';
    const OID_PHYSICAL_DELIVERY_OFFICE_NAME = '2.5.4.19';
    const OID_TELEPHONE_NUMBER = '2.5.4.20';
    const OID_TELEX_NUMBER = '2.5.4.21';
    const OID_TELETEX_TERMINAL_IDENTIFIER = '2.5.4.22';
    const OID_FACSIMILE_TELEPHONE_NUMBER = '2.5.4.23';
    const OID_X121_ADDRESS = '2.5.4.24';
    const OID_INTERNATIONAL_ISDN_NUMBER = '2.5.4.25';
    const OID_REGISTERED_ADDRESS = '2.5.4.26';
    const OID_DESTINATION_INDICATOR = '2.5.4.27';
    const OID_PREFERRED_DELIVERY_METHOD = '2.5.4.28';
    const OID_PRESENTATION_ADDRESS = '2.5.4.29';
    const OID_SUPPORTED_APPLICATION_CONTEXT = '2.5.4.30';
    const OID_MEMBER = '2.5.4.31';
    const OID_OWNER = '2.5.4.32';
    const OID_ROLE_OCCUPANT = '2.5.4.33';
    const OID_SEE_ALSO = '2.5.4.34';
    const OID_USER_PASSWORD = '2.5.4.35';
    const OID_USER_CERTIFICATE = '2.5.4.36';
    const OID_CA_CERTIFICATE = '2.5.4.37';
    const OID_AUTHORITY_REVOCATION_LIST = '2.5.4.38';
    const OID_CERTIFICATE_REVOCATION_LIST = '2.5.4.39';
    const OID_CROSS_CERTIFICATE_PAIR = '2.5.4.40';
    const OID_NAME = '2.5.4.41';
    const OID_GIVEN_NAME = '2.5.4.42';
    const OID_INITIALS = '2.5.4.43';
    const OID_GENERATION_QUALIFIER = '2.5.4.44';
    const OID_UNIQUE_IDENTIFIER = '2.5.4.45';
    const OID_DN_QUALIFIER = '2.5.4.46';
    const OID_ENHANCED_SEARCH_GUIDE = '2.5.4.47';
    const OID_PROTOCOL_INFORMATION = '2.5.4.48';
    const OID_DISTINGUISHED_NAME = '2.5.4.49';
    const OID_UNIQUE_MEMBER = '2.5.4.50';
    const OID_HOUSE_IDENTIFIER = '2.5.4.51';
    const OID_SUPPORTED_ALGORITHMS = '2.5.4.52';
    const OID_DELTA_REVOCATION_LIST = '2.5.4.53';
    const OID_DMD_NAME = '2.5.4.54';
    const OID_CLEARANCE = '2.5.4.55';
    const OID_DEFAULT_DIR_QOP = '2.5.4.56';
    const OID_ATTRIBUTE_INTEGRITY_INFO = '2.5.4.57';
    const OID_ATTRIBUTE_CERTIFICATE = '2.5.4.58';
    const OID_ATTRIBUTE_CERTIFICATE_REVOCATION_LIST = '2.5.4.59';
    const OID_CONF_KEY_INFO = '2.5.4.60';
    const OID_AA_CERTIFICATE = '2.5.4.61';
    const OID_ATTRIBUTE_DESCRIPTOR_CERTIFICATE = '2.5.4.62';
    const OID_ATTRIBUTE_AUTHORITY_REVOCATION_LIST = '2.5.4.63';
    const OID_FAMILY_INFORMATION = '2.5.4.64';
    const OID_PSEUDONYM = '2.5.4.65';
    const OID_COMMUNICATIONS_SERVICE = '2.5.4.66';
    const OID_COMMUNICATIONS_NETWORK = '2.5.4.67';
    const OID_CERTIFICATION_PRACTICE_STMT = '2.5.4.68';
    const OID_CERTIFICATE_POLICY = '2.5.4.69';
    const OID_PKI_PATH = '2.5.4.70';
    const OID_PRIV_POLICY = '2.5.4.71';
    const OID_ROLE = '2.5.4.72';
    const OID_DELEGATION_PATH = '2.5.4.73';
    const OID_PROT_PRIV_POLICY = '2.5.4.74';
    const OID_XML_PRIVILEGE_INFO = '2.5.4.75';
    const OID_XML_PRIV_POLICY = '2.5.4.76';
    const OID_UUID_PAIR = '2.5.4.77';
    const OID_TAG_OID = '2.5.4.78';
    const OID_UII_FORMAT = '2.5.4.79';
    const OID_UII_IN_URH = '2.5.4.80';
    const OID_CONTENT_URL = '2.5.4.81';
    const OID_PERMISSION = '2.5.4.82';
    const OID_URI = '2.5.4.83';
    const OID_PWD_ATTRIBUTE = '2.5.4.84';
    const OID_USER_PWD = '2.5.4.85';
    const OID_URN = '2.5.4.86';
    const OID_URL = '2.5.4.87';
    const OID_UTM_COORDINATES = '2.5.4.88';
    const OID_URNC = '2.5.4.89';
    const OID_UII = '2.5.4.90';
    const OID_EPC = '2.5.4.91';
    const OID_TAG_AFI = '2.5.4.92';
    const OID_EPC_FORMAT = '2.5.4.93';
    const OID_EPC_IN_URN = '2.5.4.94';
    const OID_LDAP_URL = '2.5.4.95';
    const OID_TAG_LOCATION = '2.5.4.96';
    const OID_ORGANIZATION_IDENTIFIER = '2.5.4.97';

    // Miscellany attribute OID's
    const OID_CLEARANCE_X501 = '2.5.1.5.55';

    /**
     * Default ASN.1 string types for attributes.
     *
     * Attributes not mapped here shall use UTF8String as a default type.
     *
     * @internal
     *
     * @var array
     */
    const MAP_ATTR_TO_STR_TYPE = [
        self::OID_DN_QUALIFIER => Element::TYPE_PRINTABLE_STRING,
        self::OID_COUNTRY_NAME => Element::TYPE_PRINTABLE_STRING,
        self::OID_SERIAL_NUMBER => Element::TYPE_PRINTABLE_STRING,
    ];

    /**
     * OID to attribute names mapping.
     *
     * First name is the primary name. If there's more than one name, others may
     * be used as an alias.
     *
     * Generated using ldap-attribs.py.
     *
     * @internal
     *
     * @var array
     */
    const MAP_OID_TO_NAME = [
        '0.9.2342.19200300.100.1.1' => ['uid', 'userid'],
        '0.9.2342.19200300.100.1.2' => ['textEncodedORAddress'],
        '0.9.2342.19200300.100.1.3' => ['mail', 'rfc822Mailbox'],
        '0.9.2342.19200300.100.1.4' => ['info'],
        '0.9.2342.19200300.100.1.5' => ['drink', 'favouriteDrink'],
        '0.9.2342.19200300.100.1.6' => ['roomNumber'],
        '0.9.2342.19200300.100.1.7' => ['photo'],
        '0.9.2342.19200300.100.1.8' => ['userClass'],
        '0.9.2342.19200300.100.1.9' => ['host'],
        '0.9.2342.19200300.100.1.10' => ['manager'],
        '0.9.2342.19200300.100.1.11' => ['documentIdentifier'],
        '0.9.2342.19200300.100.1.12' => ['documentTitle'],
        '0.9.2342.19200300.100.1.13' => ['documentVersion'],
        '0.9.2342.19200300.100.1.14' => ['documentAuthor'],
        '0.9.2342.19200300.100.1.15' => ['documentLocation'],
        '0.9.2342.19200300.100.1.20' => ['homePhone', 'homeTelephoneNumber'],
        '0.9.2342.19200300.100.1.21' => ['secretary'],
        '0.9.2342.19200300.100.1.22' => ['otherMailbox'],
        '0.9.2342.19200300.100.1.25' => ['dc', 'domainComponent'],
        '0.9.2342.19200300.100.1.26' => ['aRecord'],
        '0.9.2342.19200300.100.1.27' => ['mDRecord'],
        '0.9.2342.19200300.100.1.28' => ['mXRecord'],
        '0.9.2342.19200300.100.1.29' => ['nSRecord'],
        '0.9.2342.19200300.100.1.30' => ['sOARecord'],
        '0.9.2342.19200300.100.1.31' => ['cNAMERecord'],
        '0.9.2342.19200300.100.1.37' => ['associatedDomain'],
        '0.9.2342.19200300.100.1.38' => ['associatedName'],
        '0.9.2342.19200300.100.1.39' => ['homePostalAddress'],
        '0.9.2342.19200300.100.1.40' => ['personalTitle'],
        '0.9.2342.19200300.100.1.41' => ['mobile', 'mobileTelephoneNumber'],
        '0.9.2342.19200300.100.1.42' => ['pager', 'pagerTelephoneNumber'],
        '0.9.2342.19200300.100.1.43' => ['co', 'friendlyCountryName'],
        '0.9.2342.19200300.100.1.44' => ['uniqueIdentifier'],
        '0.9.2342.19200300.100.1.45' => ['organizationalStatus'],
        '0.9.2342.19200300.100.1.46' => ['janetMailbox'],
        '0.9.2342.19200300.100.1.47' => ['mailPreferenceOption'],
        '0.9.2342.19200300.100.1.48' => ['buildingName'],
        '0.9.2342.19200300.100.1.49' => ['dSAQuality'],
        '0.9.2342.19200300.100.1.50' => ['singleLevelQuality'],
        '0.9.2342.19200300.100.1.51' => ['subtreeMinimumQuality'],
        '0.9.2342.19200300.100.1.52' => ['subtreeMaximumQuality'],
        '0.9.2342.19200300.100.1.53' => ['personalSignature'],
        '0.9.2342.19200300.100.1.54' => ['dITRedirect'],
        '0.9.2342.19200300.100.1.55' => ['audio'],
        '0.9.2342.19200300.100.1.56' => ['documentPublisher'],
        '0.9.2342.19200300.100.1.60' => ['jpegPhoto'],
        '1.2.840.113549.1.9.1' => ['email', 'emailAddress', 'pkcs9email'],
        '1.2.840.113556.1.2.102' => ['memberOf'],
        '1.3.6.1.1.1.1.0' => ['uidNumber'],
        '1.3.6.1.1.1.1.1' => ['gidNumber'],
        '1.3.6.1.1.1.1.2' => ['gecos'],
        '1.3.6.1.1.1.1.3' => ['homeDirectory'],
        '1.3.6.1.1.1.1.4' => ['loginShell'],
        '1.3.6.1.1.1.1.5' => ['shadowLastChange'],
        '1.3.6.1.1.1.1.6' => ['shadowMin'],
        '1.3.6.1.1.1.1.7' => ['shadowMax'],
        '1.3.6.1.1.1.1.8' => ['shadowWarning'],
        '1.3.6.1.1.1.1.9' => ['shadowInactive'],
        '1.3.6.1.1.1.1.10' => ['shadowExpire'],
        '1.3.6.1.1.1.1.11' => ['shadowFlag'],
        '1.3.6.1.1.1.1.12' => ['memberUid'],
        '1.3.6.1.1.1.1.13' => ['memberNisNetgroup'],
        '1.3.6.1.1.1.1.14' => ['nisNetgroupTriple'],
        '1.3.6.1.1.1.1.15' => ['ipServicePort'],
        '1.3.6.1.1.1.1.16' => ['ipServiceProtocol'],
        '1.3.6.1.1.1.1.17' => ['ipProtocolNumber'],
        '1.3.6.1.1.1.1.18' => ['oncRpcNumber'],
        '1.3.6.1.1.1.1.19' => ['ipHostNumber'],
        '1.3.6.1.1.1.1.20' => ['ipNetworkNumber'],
        '1.3.6.1.1.1.1.21' => ['ipNetmaskNumber'],
        '1.3.6.1.1.1.1.22' => ['macAddress'],
        '1.3.6.1.1.1.1.23' => ['bootParameter'],
        '1.3.6.1.1.1.1.24' => ['bootFile'],
        '1.3.6.1.1.1.1.26' => ['nisMapName'],
        '1.3.6.1.1.1.1.27' => ['nisMapEntry'],
        '1.3.6.1.1.4' => ['vendorName'],
        '1.3.6.1.1.5' => ['vendorVersion'],
        '1.3.6.1.1.16.4' => ['entryUUID'],
        '1.3.6.1.1.20' => ['entryDN'],
        '2.5.4.0' => ['objectClass'],
        '2.5.4.1' => ['aliasedObjectName', 'aliasedEntryName'],
        '2.5.4.2' => ['knowledgeInformation'],
        '2.5.4.3' => ['cn', 'commonName'],
        '2.5.4.4' => ['sn', 'surname'],
        '2.5.4.5' => ['serialNumber'],
        '2.5.4.6' => ['c', 'countryName'],
        '2.5.4.7' => ['l', 'localityName'],
        '2.5.4.8' => ['st', 'stateOrProvinceName'],
        '2.5.4.9' => ['street', 'streetAddress'],
        '2.5.4.10' => ['o', 'organizationName'],
        '2.5.4.11' => ['ou', 'organizationalUnitName'],
        '2.5.4.12' => ['title'],
        '2.5.4.13' => ['description'],
        '2.5.4.14' => ['searchGuide'],
        '2.5.4.15' => ['businessCategory'],
        '2.5.4.16' => ['postalAddress'],
        '2.5.4.17' => ['postalCode'],
        '2.5.4.18' => ['postOfficeBox'],
        '2.5.4.19' => ['physicalDeliveryOfficeName'],
        '2.5.4.20' => ['telephoneNumber'],
        '2.5.4.21' => ['telexNumber'],
        '2.5.4.22' => ['teletexTerminalIdentifier'],
        '2.5.4.23' => ['facsimileTelephoneNumber', 'fax'],
        '2.5.4.24' => ['x121Address'],
        '2.5.4.25' => ['internationaliSDNNumber'],
        '2.5.4.26' => ['registeredAddress'],
        '2.5.4.27' => ['destinationIndicator'],
        '2.5.4.28' => ['preferredDeliveryMethod'],
        '2.5.4.29' => ['presentationAddress'],
        '2.5.4.30' => ['supportedApplicationContext'],
        '2.5.4.31' => ['member'],
        '2.5.4.32' => ['owner'],
        '2.5.4.33' => ['roleOccupant'],
        '2.5.4.34' => ['seeAlso'],
        '2.5.4.35' => ['userPassword'],
        '2.5.4.36' => ['userCertificate'],
        '2.5.4.37' => ['cACertificate'],
        '2.5.4.38' => ['authorityRevocationList'],
        '2.5.4.39' => ['certificateRevocationList'],
        '2.5.4.40' => ['crossCertificatePair'],
        '2.5.4.41' => ['name'],
        '2.5.4.42' => ['givenName', 'gn'],
        '2.5.4.43' => ['initials'],
        '2.5.4.44' => ['generationQualifier'],
        '2.5.4.45' => ['x500UniqueIdentifier'],
        '2.5.4.46' => ['dnQualifier'],
        '2.5.4.47' => ['enhancedSearchGuide'],
        '2.5.4.48' => ['protocolInformation'],
        '2.5.4.49' => ['distinguishedName'],
        '2.5.4.50' => ['uniqueMember'],
        '2.5.4.51' => ['houseIdentifier'],
        '2.5.4.52' => ['supportedAlgorithms'],
        '2.5.4.53' => ['deltaRevocationList'],
        '2.5.4.54' => ['dmdName'],
        '2.5.4.65' => ['pseudonym'],
        '2.5.18.1' => ['createTimestamp'],
        '2.5.18.2' => ['modifyTimestamp'],
        '2.5.18.3' => ['creatorsName'],
        '2.5.18.4' => ['modifiersName'],
        '2.5.18.5' => ['administrativeRole'],
        '2.5.18.6' => ['subtreeSpecification'],
        '2.5.18.9' => ['hasSubordinates'],
        '2.5.18.10' => ['subschemaSubentry'],
        '2.5.21.1' => ['dITStructureRules'],
        '2.5.21.2' => ['dITContentRules'],
        '2.5.21.4' => ['matchingRules'],
        '2.5.21.5' => ['attributeTypes'],
        '2.5.21.6' => ['objectClasses'],
        '2.5.21.7' => ['nameForms'],
        '2.5.21.8' => ['matchingRuleUse'],
        '2.5.21.9' => ['structuralObjectClass'],
        '2.16.840.1.113730.3.1.1' => ['carLicense'],
        '2.16.840.1.113730.3.1.2' => ['departmentNumber'],
        '2.16.840.1.113730.3.1.3' => ['employeeNumber'],
        '2.16.840.1.113730.3.1.4' => ['employeeType'],
        '2.16.840.1.113730.3.1.34' => ['ref'],
        '2.16.840.1.113730.3.1.39' => ['preferredLanguage'],
        '2.16.840.1.113730.3.1.40' => ['userSMIMECertificate'],
        '2.16.840.1.113730.3.1.216' => ['userPKCS12'],
        '2.16.840.1.113730.3.1.241' => ['displayName'],
    ];

    /**
     * OID of the attribute.
     *
     * @var string
     */
    protected $_oid;

    /**
     * Constructor.
     *
     * @param string $oid OID in dotted format
     */
    public function __construct(string $oid)
    {
        $this->_oid = $oid;
    }

    /**
     * Initialize from ASN.1.
     *
     * @param ObjectIdentifier $oi
     *
     * @return self
     */
    public static function fromASN1(ObjectIdentifier $oi): self
    {
        return new self($oi->oid());
    }

    /**
     * Initialize from attribute name.
     *
     * @param string $name
     *
     * @return self
     */
    public static function fromName(string $name): self
    {
        $oid = self::attrNameToOID($name);
        return new self($oid);
    }

    /**
     * Get OID of the attribute.
     *
     * @return string OID in dotted format
     */
    public function oid(): string
    {
        return $this->_oid;
    }

    /**
     * Get name of the attribute.
     *
     * @return string
     */
    public function typeName(): string
    {
        if (array_key_exists($this->_oid, self::MAP_OID_TO_NAME)) {
            return self::MAP_OID_TO_NAME[$this->_oid][0];
        }
        return $this->_oid;
    }

    /**
     * Generate ASN.1 element.
     *
     * @return ObjectIdentifier
     */
    public function toASN1(): ObjectIdentifier
    {
        return new ObjectIdentifier($this->_oid);
    }

    /**
     * Convert attribute name to OID.
     *
     * @param string $name Primary attribute name or an alias
     *
     * @throws \OutOfBoundsException
     *
     * @return string OID in dotted format
     */
    public static function attrNameToOID(string $name): string
    {
        // if already in OID form
        if (preg_match('/^[0-9]+(?:\.[0-9]+)*$/', $name)) {
            return $name;
        }
        $map = self::_oidReverseMap();
        $k = strtolower($name);
        if (!isset($map[$k])) {
            throw new \OutOfBoundsException("No OID for {$name}.");
        }
        return $map[$k];
    }

    /**
     * Get ASN.1 string for given attribute type.
     *
     * @param string $oid Attribute OID
     * @param string $str String
     *
     * @throws \LogicException
     *
     * @return StringType
     */
    public static function asn1StringForType(string $oid, string $str): StringType
    {
        if (!array_key_exists($oid, self::MAP_ATTR_TO_STR_TYPE)) {
            return new UTF8String($str);
        }
        switch (self::MAP_ATTR_TO_STR_TYPE[$oid]) {
            case Element::TYPE_PRINTABLE_STRING:
                return new PrintableString($str);
            // @codeCoverageIgnoreStart
            default:
                // only reachable during development
                throw new \LogicException();
        }
        // @codeCoverageIgnoreEnd
    }

    /**
     * Get name to OID lookup map.
     *
     * @return array
     */
    private static function _oidReverseMap(): array
    {
        static $map;
        if (!isset($map)) {
            $map = [];
            // for each attribute type
            foreach (self::MAP_OID_TO_NAME as $oid => $names) {
                // for primary name and aliases
                foreach ($names as $name) {
                    $map[strtolower($name)] = $oid;
                }
            }
        }
        return $map;
    }
}
