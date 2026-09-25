"""Test phần ghép cụm, danh mục và định dạng số của pipeline (không gọi mạng)."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import gen_meta_comps as gen  # noqa: E402
import meta_snapshot as ms  # noqa: E402


def cluster(units, name='', builds=()):
    return {'units_string': ', '.join(units), 'name_string': name, 'builds': list(builds)}


class UnitNameTest(unittest.TestCase):
    def test_metatft_api_names_map_to_site_names(self):
        self.assertEqual(gen.unit_name('DA_18_KhaZix'), "Kha'Zix")
        self.assertEqual(gen.unit_name('DA_KogMaw18_AD'), "Kog'Maw")
        self.assertEqual(gen.unit_name('DA_Amumu18'), 'Amumu')
        self.assertEqual(gen.unit_name('DA_18_ElderDragon'), 'The Elder Dragon')


class MatchingTest(unittest.TestCase):
    """Khi MetaTFT phân cụm lại (vd 424 → 425 ngày 25/09/2026)."""

    stats = {'x': {'avg': 4.4}, 'y': {'avg': 4.6}}

    def test_identical_units_match_automatically(self):
        cat = {'x': cluster(['DA_18_Veigar', 'DA_18_Ornn', 'DA_18_LeBlanc'])}
        found, score = gen.best_match({'Veigar', 'Ornn', 'LeBlanc'}, cat, self.stats)
        self.assertEqual(found, 'x')
        self.assertGreaterEqual(score, gen.AUTO_MATCH)

    def test_same_metatft_name_beats_higher_unit_overlap(self):
        # lỗi đã gặp: Morgana + Alune bị ghép nhầm vào cụm Ahri chỉ vì trùng tướng hơn
        units = {'Morgana', 'Alune', 'Diana', 'Taric', 'Cassiopeia', 'Elise'}
        cat = {
            'x': cluster(['DA_18_Morgana', 'DA_18_Alune', 'DA_18_Diana', 'DA_18_Taric', 'DA_18_Hecarim'],
                         name='DA_18_Invoker, DA_18_Morgana'),
            'y': cluster(['DA_18_Morgana', 'DA_18_Alune', 'DA_18_Diana', 'DA_18_Taric', 'DA_18_Cassiopeia', 'DA_18_Ahri'],
                         name='DA_18_Vanguard, DA_18_Ahri'),
        }
        ranked = gen.candidates(units, cat, self.stats, name='DA_18_Invoker, DA_18_Morgana')
        self.assertEqual(ranked[0][1], 'x')

    def test_low_overlap_is_left_for_review(self):
        cat = {'x': cluster(['DA_18_Warwick', 'DA_18_Azir', 'DA_18_Krug'])}
        found, _ = gen.best_match({'Brambleback', 'Akali', 'Nidalee', 'Warwick'}, cat, self.stats)
        self.assertIsNone(found)


class CatalogTest(unittest.TestCase):
    def test_hash_ignores_volatile_build_counts(self):
        # lỗi đã gặp: lượt build đổi liên tục làm danh mục bị lưu lại mỗi lần chụp
        a = {'1': cluster(['DA_18_Zyra'], 'Zyra', [{'unit': 'DA_18_Zyra', 'count': 10}])}
        b = {'1': cluster(['DA_18_Zyra'], 'Zyra', [{'unit': 'DA_18_Zyra', 'count': 99}])}
        self.assertEqual(ms.catalog_hash(a), ms.catalog_hash(b))

    def test_hash_changes_when_comp_structure_changes(self):
        a = {'1': cluster(['DA_18_Zyra'], 'Zyra')}
        b = {'1': cluster(['DA_18_Zyra', 'DA_18_Sivir'], 'Zyra')}
        self.assertNotEqual(ms.catalog_hash(a), ms.catalog_hash(b))


class FormatTest(unittest.TestCase):
    def test_vietnamese_number_format(self):
        # lỗi đã gặp: replace(',', '.') áp lên cả dòng làm hỏng dấu thập phân
        self.assertEqual(ms.fmt(4.2), '4,20')
        self.assertEqual(ms.fmt(55.44, 1), '55,4')
        self.assertEqual(ms.fmt_int(462360), '462.360')


class PatchLabelTest(unittest.TestCase):
    def test_repo_patch_is_latest_live_entry(self):
        label, report_id = ms.repo_patch()
        self.assertRegex(label, r'^\d+\.\d+[a-z]?$')
        self.assertTrue(report_id.startswith('patch-tft'))


if __name__ == '__main__':
    unittest.main()
