"""Test quy tắc xếp loại (rules.py). Chạy: python -m unittest discover -s scripts/meta/tests"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import rules  # noqa: E402


def stat(avg, n, top4=50.0, win=12.5, pick=1.0):
    return {'avg': avg, 'n': n, 'top4': top4, 'win': win, 'pick': pick}


class VerdictTest(unittest.TestCase):
    def test_strong_and_confident_is_meta(self):
        self.assertEqual(rules.verdict(stat(4.20, 20000)), 'meta')

    def test_strong_but_thin_sample_is_predicted_not_meta(self):
        # 4,35 với 300 trận: cận trên 4,35 + 2×0,13 > 4,50 → chưa chắc
        self.assertEqual(rules.verdict(stat(4.35, 300)), 'predicted')

    def test_confidence_threshold_scales_with_sample(self):
        # cùng 4,39: đủ mẫu thì ★, mẫu nhỏ thì ◆
        self.assertEqual(rules.verdict(stat(4.39, 5000)), 'meta')
        self.assertEqual(rules.verdict(stat(4.39, 800)), 'predicted')

    def test_big_sample_just_above_meta_is_viable_not_predicted(self):
        # lỗi đã gặp: Elder Dragon 4,45 với 56 nghìn trận từng bị gắn ◆
        self.assertEqual(rules.verdict(stat(4.45, 56000)), 'viable')

    def test_thin_sample_near_meta_is_predicted(self):
        self.assertEqual(rules.verdict(stat(4.44, 500)), 'predicted')

    def test_weak_is_avoid_regardless_of_trend(self):
        self.assertEqual(rules.verdict(stat(4.70, 20000)), 'avoid')
        self.assertEqual(rules.verdict(stat(4.60, 20000)), 'viable')

    def test_prediction_only_overrides_thin_samples(self):
        up = {'direction': 'up', 'reason': 'buff'}
        down = {'direction': 'down', 'reason': 'nerf'}
        self.assertEqual(rules.verdict(stat(4.80, 200), up), 'predicted')
        self.assertEqual(rules.verdict(stat(4.20, 200), down), 'viable')
        # đủ mẫu thì số liệu thắng dự đoán
        self.assertEqual(rules.verdict(stat(4.80, 5000), up), 'avoid')
        self.assertEqual(rules.verdict(stat(4.20, 20000), down), 'meta')


class ChangeTest(unittest.TestCase):
    def test_trend_step(self):
        self.assertEqual(rules.trend(4.30, 4.40), 'up')
        self.assertEqual(rules.trend(4.44, 4.40), 'flat')
        self.assertEqual(rules.trend(4.46, 4.40), 'down')

    def test_falling_needs_size_and_significance(self):
        old = stat(4.40, 10000)
        self.assertTrue(rules.falling(old, stat(4.60, 10000)))
        self.assertFalse(rules.falling(old, stat(4.50, 10000)))   # chưa đủ 0,15
        self.assertFalse(rules.falling(stat(4.40, 40), stat(4.60, 40)))  # mẫu quá nhỏ, là nhiễu
        self.assertFalse(rules.falling(None, stat(4.60, 10000)))

    def test_significant_change_ignores_empty_samples(self):
        self.assertFalse(rules.significant_change(stat(4.4, 0), stat(4.9, 100)))


class ShapeTest(unittest.TestCase):
    def test_hold_and_ceiling(self):
        self.assertEqual(rules.shapes(stat(4.1, 20000, top4=57.0, win=20.0)), ['hold', 'ceiling'])
        self.assertEqual(rules.shapes(stat(4.3, 20000, top4=55.0, win=9.0)), ['hold'])

    def test_shapes_require_significance(self):
        # 55% Top 4 trên 100 trận vẫn có thể chỉ là may
        self.assertEqual(rules.shapes(stat(4.3, 100, top4=55.0, win=19.0)), [])


class ContestTest(unittest.TestCase):
    catalog = {
        'a': {'builds': [{'unit': 'DA_18_Aphelios', 'count': 900}, {'unit': 'DA_18_Vi', 'count': 1000}]},
        'b': {'builds': [{'unit': 'DA_18_Aphelios', 'count': 800}, {'unit': 'DA_18_Brambleback', 'count': 100}]},
        'c': {'builds': [{'unit': 'DA_18_Aphelios', 'count': 100}, {'unit': 'DA_18_Kayle', 'count': 900}]},
    }
    stats = {'a': {'pick': 6.0}, 'b': {'pick': 3.0}, 'c': {'pick': 2.0}}

    def test_item_holders_drop_minor_holders(self):
        self.assertEqual(rules.item_holders(self.catalog['c']), {'DA_18_Kayle'})
        self.assertEqual(rules.item_holders(self.catalog['a']), {'DA_18_Aphelios', 'DA_18_Vi'})

    def test_contest_sums_clusters_sharing_the_carry(self):
        # cụm a (6) + cụm b (Aphelios cầm đồ chính, 3); cụm c chỉ là carry phụ → không cộng
        self.assertAlmostEqual(rules.carry_contest_pick('DA_18_Aphelios', 'a', self.catalog, self.stats), 9.0)

    def test_expected_opponents(self):
        self.assertAlmostEqual(rules.expected_opponents(rules.CONTESTED_PICK), 0.7)


if __name__ == '__main__':
    unittest.main()
