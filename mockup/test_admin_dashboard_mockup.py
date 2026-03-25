import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from admin_dashboard_mockup import (
    build_section_snapshot,
    build_scroll_config,
    get_admin_credentials,
    build_mock_dataset,
    build_sidebar_sections,
    build_summary_cards,
    validate_login,
)


class AdminDashboardMockupTests(unittest.TestCase):
    def test_build_mock_dataset_exposes_expected_sections(self) -> None:
        dataset = build_mock_dataset()

        self.assertTrue(
            {
                "kpis",
                "sales",
                "orders",
                "users",
                "inventory",
                "alerts",
                "clients",
                "pipeline",
                "activity",
            }.issubset(set(dataset.keys()))
        )
        self.assertGreaterEqual(len(dataset["orders"]), 4)
        self.assertGreaterEqual(len(dataset["alerts"]), 3)
        self.assertGreaterEqual(len(dataset["clients"]), 4)
        self.assertGreaterEqual(len(dataset["pipeline"]), 3)
        self.assertGreaterEqual(len(dataset["activity"]), 4)

    def test_build_summary_cards_calculates_admin_metrics(self) -> None:
        dataset = {
            "kpis": {
                "monthly_revenue": 18450000,
                "active_orders": 21,
                "pending_approvals": 6,
                "active_users": 128,
            },
            "sales": [],
            "orders": [
                {"status": "Pendiente"},
                {"status": "En preparacion"},
                {"status": "Entregado"},
                {"status": "Pendiente"},
            ],
            "users": [
                {"role": "Administrador", "active": True},
                {"role": "Vendedor", "active": True},
                {"role": "Bodega", "active": False},
                {"role": "Socio", "active": True},
            ],
            "inventory": [
                {"stock": 3, "critical_threshold": 5},
                {"stock": 12, "critical_threshold": 5},
                {"stock": 2, "critical_threshold": 4},
            ],
            "alerts": [
                {"severity": "Alta"},
                {"severity": "Media"},
            ],
        }

        cards = build_summary_cards(dataset)

        self.assertEqual(cards["Ingresos del mes"], "$18.450.000")
        self.assertEqual(cards["Pedidos activos"], "21")
        self.assertEqual(cards["Aprobaciones pendientes"], "6")
        self.assertEqual(cards["Usuarios activos"], "3")
        self.assertEqual(cards["Stock critico"], "2")

    def test_build_sidebar_sections_returns_admin_navigation(self) -> None:
        sections = build_sidebar_sections()

        self.assertGreaterEqual(len(sections), 6)
        self.assertEqual(sections[0]["title"], "Resumen")
        self.assertIn("badge", sections[0])
        self.assertTrue(any(section["title"] == "Inventario" for section in sections))
        self.assertTrue(any(section["title"] == "Configuracion" for section in sections))

    def test_build_section_snapshot_returns_view_specific_content(self) -> None:
        dataset = build_mock_dataset()

        inventory_snapshot = build_section_snapshot("Inventario", dataset)
        sales_snapshot = build_section_snapshot("Ventas", dataset)
        fallback_snapshot = build_section_snapshot("No existe", dataset)

        self.assertEqual(inventory_snapshot["title"], "Inventario Estratégico")
        self.assertGreaterEqual(len(inventory_snapshot["highlights"]), 2)
        self.assertEqual(sales_snapshot["title"], "Ventas Enterprise")
        self.assertEqual(fallback_snapshot["title"], "Resumen Ejecutivo")

    def test_build_scroll_config_returns_vertical_scroll_setup(self) -> None:
        config = build_scroll_config()

        self.assertEqual(config["axis"], "vertical")
        self.assertEqual(config["mousewheel_step"], 1)
        self.assertTrue(config["use_canvas"])

    def test_validate_login_accepts_expected_admin_credentials(self) -> None:
        credentials = get_admin_credentials()

        self.assertTrue(
            validate_login(credentials["email"], credentials["password"])
        )
        self.assertFalse(validate_login("admin@protonlab.cl", "wrong"))
        self.assertFalse(validate_login("user@protonlab.cl", "admin123"))


if __name__ == "__main__":
    unittest.main()
