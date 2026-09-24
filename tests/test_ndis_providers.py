import unittest

from lib.ndis_providers import aggregate_providers, classify_provider, has_core_disability_groups, is_darwin_text, parse_register_rows


CSV = """Provider business name,Legal name,ABN,Head office address,Website,Registration status,Period of registration in force until,Approved registration groups,Conditions of registration,Outlet name,Outlet address,Outlet phone
Loving Arms Care,LOVING ARMS CARE PTY LTD,93626262208,"DARWIN CITY, NT, 0800, AU",https://www.lovingarmscare.com.au,Approved,25 June 2027,Assist-Personal Activities; Participate Community,,HQ,"1 Smith ST, Darwin, NT, 0800, AU",+61080000001
Total Recreation,TOTAL RECREATION NT INC,92148147305,"CASUARINA, NT, 0810, AU",https://www.totalrecreation.org.au,Approved,31 May 2027,Group/Centre Activities; Participate Community,,TR,"Casuarina, NT, 0810, AU",+61080000002
Hunter Carers,HUNTER CARERS LTD,48055975927,"CARDIFF, NSW, 2285, AU",https://huntercarers.org.au,Approved,10 November 2028,Assist-Personal Activities; Supported Independent Living,,Hunter,"Cardiff, NSW, 2285, AU",
Clinic Only,CLINIC ONLY PTY LTD,11111111111,"SYDNEY, NSW, 2000, AU",https://clinic.example,Approved,1 January 2027,Therapeutic Supports,,Clinic,"Sydney, NSW, 2000, AU",
East Arnhem,East Arnhem Regional Council,92334301078,"DARWIN CITY, NT, 0800, AU",https://www.eastarnhem.net.au,Approved,08 November 2027,Assist-Personal Activities,,Council,"Darwin, NT, 0800, AU",
Sole Trader,"NICHOLLS, TIMOTHY JOHN",22222222222,"DARWIN CITY, NT, 0800, AU",,Approved,1 January 2027,Therapeutic Supports,,Ortho,"Darwin, NT, 0800, AU",
Revoked Co,REVOKED CARE PTY LTD,33333333333,"DARWIN CITY, NT, 0800, AU",,Revoked,1 January 2020,Assist-Personal Activities,,Old,"Darwin, NT, 0800, AU",
"""


class NdisProviderFilterTest(unittest.TestCase):
    def test_classify_disability_company_and_nonprofit(self):
        self.assertEqual(
            classify_provider("LOVING ARMS CARE PTY LTD", "Loving Arms", "Assist-Personal Activities")[0],
            "disability_company",
        )
        self.assertEqual(
            classify_provider("TOTAL RECREATION NT INC", "Total Recreation", "Group/Centre Activities")[0],
            "nonprofit",
        )
        self.assertEqual(
            classify_provider("HUNTER CARERS LTD", "Hunter Carers", "Supported Independent Living")[0],
            "nonprofit",
        )
        self.assertIsNone(classify_provider("CLINIC ONLY PTY LTD", "Clinic", "Therapeutic Supports"))
        self.assertIsNone(classify_provider("East Arnhem Regional Council", "East Arnhem", "Assist-Personal Activities"))
        self.assertIsNone(classify_provider("NICHOLLS, TIMOTHY JOHN", "Ortho", "Therapeutic Supports"))
        self.assertIsNone(classify_provider("ALLIANZ AUSTRALIA INSURANCE LIMITED", "Allianz", "Assist-Personal Activities"))
        self.assertIsNone(classify_provider("Healthia Podiatry Limited", "Healthia Podiatry", "Therapeutic Supports"))

    def test_core_groups_and_darwin(self):
        self.assertTrue(has_core_disability_groups("Assist-Personal Activities; Plan Management"))
        self.assertFalse(has_core_disability_groups("Therapeutic Supports; Plan Management"))
        self.assertTrue(is_darwin_text("CASUARINA, NT, 0810, AU"))
        self.assertFalse(is_darwin_text("ALICE SPRINGS, NT, 0870, AU"))

    def test_aggregate_keeps_approved_targets_only(self):
        rows = aggregate_providers(parse_register_rows(CSV))
        names = {r["legal_name"] for r in rows}
        self.assertIn("LOVING ARMS CARE PTY LTD", names)
        self.assertIn("TOTAL RECREATION NT INC", names)
        self.assertIn("HUNTER CARERS LTD", names)
        self.assertNotIn("CLINIC ONLY PTY LTD", names)
        self.assertNotIn("East Arnhem Regional Council", names)
        self.assertNotIn("NICHOLLS, TIMOTHY JOHN", names)
        self.assertNotIn("REVOKED CARE PTY LTD", names)
        loving = next(r for r in rows if r["abn"] == "93626262208")
        self.assertEqual(loving["has_darwin_presence"], "yes")
        self.assertEqual(loving["has_nt_presence"], "yes")
        hunter = next(r for r in rows if r["abn"] == "48055975927")
        self.assertEqual(hunter["has_nt_presence"], "")


if __name__ == "__main__":
    unittest.main()
