from __future__ import annotations

import tkinter as tk
from tkinter import ttk


def format_currency(amount: int) -> str:
    return f"${amount:,}".replace(",", ".")


def get_admin_credentials() -> dict[str, str]:
    return {
        "email": "admin@protonlab.cl",
        "password": "admin123",
    }


def validate_login(email: str, password: str) -> bool:
    credentials = get_admin_credentials()
    return email == credentials["email"] and password == credentials["password"]


def build_mock_dataset() -> dict[str, object]:
    return {
        "kpis": {
            "monthly_revenue": 68450000,
            "active_orders": 37,
            "pending_approvals": 9,
            "active_users": 142,
        },
        "sales": [
            {"month": "Ene", "revenue": 41200000},
            {"month": "Feb", "revenue": 48650000},
            {"month": "Mar", "revenue": 52500000},
            {"month": "Abr", "revenue": 68450000},
            {"month": "May", "revenue": 63200000},
            {"month": "Jun", "revenue": 71600000},
        ],
        "orders": [
            {"id": "PL-2042", "client": "Minera Horizonte", "status": "Pendiente", "total": "$12.400.000"},
            {"id": "PL-2041", "client": "LabGen Analytics", "status": "En preparacion", "total": "$8.250.000"},
            {"id": "PL-2039", "client": "BioCore Research", "status": "Despachado", "total": "$15.800.000"},
            {"id": "PL-2038", "client": "Industrias Vector", "status": "Entregado", "total": "$6.980.000"},
            {"id": "PL-2037", "client": "Hospital Quantum", "status": "Pendiente", "total": "$11.740.000"},
        ],
        "users": [
            {"name": "Daniela Rojas", "role": "Admin General", "active": True},
            {"name": "Tomás Vera", "role": "Ventas Enterprise", "active": True},
            {"name": "Valentina Díaz", "role": "Operaciones", "active": True},
            {"name": "Carla Soto", "role": "Especialista Lab", "active": True},
            {"name": "Pablo Mena", "role": "Soporte Digital", "active": False},
        ],
        "inventory": [
            {"sku": "PRT-LAB-2201", "product": "Analizador PCR de alta precisión", "stock": 3, "critical_threshold": 5},
            {"sku": "PRT-IND-1180", "product": "Controlador industrial IoT", "stock": 14, "critical_threshold": 12},
            {"sku": "PRT-DIG-8760", "product": "Licencia SCADA Vision Pro", "stock": 2, "critical_threshold": 4},
            {"sku": "PRT-LAB-2030", "product": "Micropipeta digital", "stock": 18, "critical_threshold": 10},
        ],
        "alerts": [
            {"severity": "Alta", "message": "2 equipos estratégicos están bajo stock de seguridad."},
            {"severity": "Alta", "message": "1 licitación industrial supera el SLA de aprobación."},
            {"severity": "Media", "message": "9 pedidos enterprise requieren visto bueno financiero."},
            {"severity": "Baja", "message": "La línea digital Protonlab Cloud alcanzó 94% de la meta mensual."},
        ],
        "clients": [
            {"name": "Minera Horizonte", "segment": "Industrial", "manager": "Tomás Vera", "mrr": "$18.500.000"},
            {"name": "BioCore Research", "segment": "Laboratorio", "manager": "Carla Soto", "mrr": "$14.200.000"},
            {"name": "Hospital Quantum", "segment": "Salud", "manager": "Daniela Rojas", "mrr": "$11.800.000"},
            {"name": "LabGen Analytics", "segment": "Diagnóstico", "manager": "Carla Soto", "mrr": "$9.600.000"},
            {"name": "Industrias Vector", "segment": "Automatización", "manager": "Tomás Vera", "mrr": "$8.900.000"},
        ],
        "pipeline": [
            {"name": "Modernización SCADA Norte", "stage": "Propuesta", "value": "$24.000.000", "owner": "Tomás Vera"},
            {"name": "Línea PCR Genómica", "stage": "Negociación", "value": "$31.500.000", "owner": "Carla Soto"},
            {"name": "Sensores IoT Planta 4", "stage": "Discovery", "value": "$16.800.000", "owner": "Valentina Díaz"},
            {"name": "Renovación Protonlab Cloud", "stage": "Cierre", "value": "$12.400.000", "owner": "Daniela Rojas"},
        ],
        "activity": [
            {"time": "09:10", "event": "BioCore Research aprobó una orden de micropipetas digitales."},
            {"time": "09:35", "event": "Se actualizó el stock de licencias SCADA Vision Pro."},
            {"time": "10:05", "event": "Minera Horizonte solicitó revisión de propuesta IoT industrial."},
            {"time": "10:40", "event": "Operaciones marcó un controlador industrial como stock crítico."},
            {"time": "11:15", "event": "Finance liberó 2 aprobaciones pendientes de pedidos enterprise."},
        ],
    }


def build_sidebar_sections() -> list[dict[str, str]]:
    return [
        {"title": "Resumen", "subtitle": "Vista global", "badge": "Live"},
        {"title": "Ventas", "subtitle": "Pipeline B2B", "badge": "12"},
        {"title": "Pedidos", "subtitle": "Seguimiento", "badge": "37"},
        {"title": "Inventario", "subtitle": "Stock critico", "badge": "2"},
        {"title": "Laboratorio", "subtitle": "Equipamiento", "badge": "8"},
        {"title": "Industrial", "subtitle": "Hardware IoT", "badge": "5"},
        {"title": "Clientes", "subtitle": "Cuentas clave", "badge": "24"},
        {"title": "Configuracion", "subtitle": "Permisos", "badge": "3"},
    ]


def build_summary_cards(dataset: dict[str, object]) -> dict[str, str]:
    kpis = dataset["kpis"]
    users = dataset["users"]
    inventory = dataset["inventory"]

    active_users = sum(1 for user in users if user["active"])
    critical_stock = sum(
        1 for item in inventory if item["stock"] <= item["critical_threshold"]
    )

    return {
        "Ingresos del mes": format_currency(kpis["monthly_revenue"]),
        "Pedidos activos": str(kpis["active_orders"]),
        "Aprobaciones pendientes": str(kpis["pending_approvals"]),
        "Usuarios activos": str(active_users),
        "Stock critico": str(critical_stock),
    }


def build_section_snapshot(section: str, dataset: dict[str, object]) -> dict[str, object]:
    snapshots = {
        "Resumen": {
            "title": "Resumen Ejecutivo",
            "description": "Estado consolidado de negocio digital, industrial y laboratorio para el comité administrativo.",
            "highlights": [
                f"Ingresos proyectados: {format_currency(dataset['sales'][-1]['revenue'])}",
                f"Pedidos activos: {dataset['kpis']['active_orders']}",
                f"Alertas abiertas: {len(dataset['alerts'])}",
            ],
        },
        "Ventas": {
            "title": "Ventas Enterprise",
            "description": "Seguimiento comercial de cuentas técnicas, licitaciones y pipeline de soluciones de alto valor.",
            "highlights": [
                "3 oportunidades industriales sobre CLP 20M",
                "Conversión técnica estable sobre 70%",
                "Protonlab Cloud lidera el crecimiento mensual",
            ],
        },
        "Pedidos": {
            "title": "Operación de Pedidos",
            "description": "Monitoreo de proyectos aprobados, órdenes en preparación y despachos críticos.",
            "highlights": [
                f"Pendientes de aprobación: {dataset['kpis']['pending_approvals']}",
                f"Último pedido: {dataset['orders'][0]['id']}",
                "SLA logístico en rango controlado",
            ],
        },
        "Inventario": {
            "title": "Inventario Estratégico",
            "description": "Control de stock de equipos, licencias y repuestos críticos para continuidad operacional.",
            "highlights": [
                "2 ítems bajo umbral de seguridad",
                "Licencias digitales con renovación este mes",
                "Equipamiento de laboratorio priorizado",
            ],
        },
        "Laboratorio": {
            "title": "Laboratorio Avanzado",
            "description": "Estado de equipamiento científico, instrumentos de precisión y disponibilidad de kits.",
            "highlights": [
                "PCR y micropipetas con alta rotación",
                "BioCore Research mantiene demanda sostenida",
                "Mantenimiento preventivo al día",
            ],
        },
        "Industrial": {
            "title": "Infraestructura Industrial",
            "description": "Supervisión de hardware IoT, controladores industriales y entregas para operación en terreno.",
            "highlights": [
                "Hardware IoT con 88% de entregas a tiempo",
                "Licitación crítica fuera de SLA",
                "Controladores con stock de resguardo mínimo",
            ],
        },
        "Clientes": {
            "title": "Cuentas Clave",
            "description": "Visibilidad de clientes enterprise, laboratorios, hospitales y grupos industriales activos.",
            "highlights": [
                f"{len(dataset['clients'])} cuentas estratégicas visibles en el panel",
                f"Top account: {dataset['clients'][0]['name']}",
                f"Manager destacado: {dataset['clients'][0]['manager']}",
            ],
        },
        "Configuracion": {
            "title": "Configuración y Accesos",
            "description": "Gestión de permisos, sincronización de plataforma y control de usuarios administrativos.",
            "highlights": [
                "3 cambios pendientes de permisos",
                "ERP Sync operativo",
                "1 usuario de soporte marcado como inactivo",
            ],
        },
    }
    return snapshots.get(section, snapshots["Resumen"])


def build_scroll_config() -> dict[str, object]:
    return {
        "axis": "vertical",
        "mousewheel_step": 1,
        "use_canvas": True,
    }


class AdminDashboardMockup(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Protonlab | Mockup Panel Admin")
        self.geometry("1380x860")
        self.minsize(1200, 760)
        self.configure(bg="#f3f6fb")

        self.dataset = build_mock_dataset()
        self.sidebar_sections = build_sidebar_sections()
        self.summary_cards = build_summary_cards(self.dataset)
        self.active_section = "Resumen"
        self.sidebar_items: list[dict[str, tk.Widget | str]] = []
        self.refresh_count = 0
        self.root_container = tk.Frame(self, bg="#081521")
        self.root_container.pack(fill="both", expand=True)

        self._build_styles()
        self._build_login_screen()

    def _build_styles(self) -> None:
        style = ttk.Style(self)
        style.theme_use("clam")
        style.configure("Card.TFrame", background="#ffffff")
        style.configure("Panel.TFrame", background="#ffffff")
        style.configure("SectionTitle.TLabel", background="#ffffff", foreground="#1c2a3a", font=("Arial", 14, "bold"))
        style.configure("Body.TLabel", background="#ffffff", foreground="#4c5c6b", font=("Arial", 10))
        style.configure("Treeview", rowheight=28, font=("Arial", 10))
        style.configure("Treeview.Heading", font=("Arial", 10, "bold"))
        style.configure("Tab.TNotebook", background="#f3f6fb", borderwidth=0)
        style.configure("Tab.TNotebook.Tab", padding=(16, 10), font=("Arial", 10, "bold"))

    def _clear_root(self) -> None:
        for child in self.root_container.winfo_children():
            child.destroy()

    def _build_login_screen(self) -> None:
        self._clear_root()
        wrapper = tk.Frame(self.root_container, bg="#081521")
        wrapper.pack(fill="both", expand=True)

        card = tk.Frame(
            wrapper,
            bg="#0b1f33",
            padx=36,
            pady=32,
            highlightbackground="#1d4e6d",
            highlightthickness=1,
        )
        card.place(relx=0.5, rely=0.5, anchor="center")

        tk.Label(
            card,
            text="PROTONLAB",
            bg="#0b1f33",
            fg="#ffffff",
            font=("Arial", 24, "bold"),
        ).pack(anchor="w")
        tk.Label(
            card,
            text="Acceso administrador",
            bg="#0b1f33",
            fg="#9fbad0",
            font=("Arial", 12),
        ).pack(anchor="w", pady=(6, 18))

        tk.Label(card, text="Correo", bg="#0b1f33", fg="#d9e2ec", font=("Arial", 10, "bold")).pack(anchor="w")
        self.email_var = tk.StringVar(value="admin@protonlab.cl")
        email_entry = tk.Entry(
            card,
            textvariable=self.email_var,
            width=34,
            font=("Arial", 11),
            relief="flat",
        )
        email_entry.pack(fill="x", pady=(6, 14), ipady=8)

        tk.Label(card, text="Contraseña", bg="#0b1f33", fg="#d9e2ec", font=("Arial", 10, "bold")).pack(anchor="w")
        self.password_var = tk.StringVar(value="admin123")
        password_entry = tk.Entry(
            card,
            textvariable=self.password_var,
            show="*",
            width=34,
            font=("Arial", 11),
            relief="flat",
        )
        password_entry.pack(fill="x", pady=(6, 10), ipady=8)

        self.login_error_var = tk.StringVar(value="")
        tk.Label(
            card,
            textvariable=self.login_error_var,
            bg="#0b1f33",
            fg="#f87171",
            font=("Arial", 10),
        ).pack(anchor="w", pady=(0, 10))

        tk.Button(
            card,
            text="Ingresar al panel",
            command=self._handle_login,
            bg="#00a8a8",
            fg="#ffffff",
            activebackground="#0891b2",
            activeforeground="#ffffff",
            relief="flat",
            cursor="hand2",
            padx=12,
            pady=10,
            font=("Arial", 10, "bold"),
        ).pack(fill="x", pady=(4, 16))

        credentials = get_admin_credentials()
        tk.Label(
            card,
            text=f"Demo: {credentials['email']} / {credentials['password']}",
            bg="#0b1f33",
            fg="#8fb3c9",
            font=("Arial", 9),
        ).pack(anchor="w")

        email_entry.bind("<Return>", lambda _event: self._handle_login())
        password_entry.bind("<Return>", lambda _event: self._handle_login())
        email_entry.focus_set()

    def _handle_login(self) -> None:
        if validate_login(self.email_var.get().strip(), self.password_var.get()):
            self._build_layout()
            return
        self.login_error_var.set("Credenciales inválidas. Usa admin@protonlab.cl y admin123.")

    def _build_layout(self) -> None:
        self._clear_root()
        shell = tk.Frame(self.root_container, bg="#f3f6fb")
        shell.pack(fill="both", expand=True)

        self._build_sidebar(shell)

        content_shell = tk.Frame(shell, bg="#f3f6fb")
        content_shell.pack(side="left", fill="both", expand=True)

        self.content_canvas = tk.Canvas(
            content_shell,
            bg="#f3f6fb",
            highlightthickness=0,
            bd=0,
        )
        self.content_canvas.pack(side="left", fill="both", expand=True)

        scrollbar = ttk.Scrollbar(
            content_shell,
            orient="vertical",
            command=self.content_canvas.yview,
        )
        scrollbar.pack(side="right", fill="y")
        self.content_canvas.configure(yscrollcommand=scrollbar.set)

        content = tk.Frame(self.content_canvas, bg="#f3f6fb", padx=24, pady=20)
        self.content_canvas_window = self.content_canvas.create_window(
            (0, 0),
            window=content,
            anchor="nw",
        )
        content.bind("<Configure>", self._on_content_configure)
        self.content_canvas.bind("<Configure>", self._on_canvas_configure)
        self._bind_mousewheel(self.content_canvas)
        self._bind_mousewheel(content)

        self._build_header(content)
        self._build_summary_row(content)
        self._build_main_grid(content)

    def _build_sidebar(self, parent: tk.Widget) -> None:
        sidebar = tk.Frame(parent, bg="#081521", width=280, padx=18, pady=20)
        sidebar.pack(side="left", fill="y")
        sidebar.pack_propagate(False)

        brand = tk.Frame(sidebar, bg="#081521")
        brand.pack(fill="x", pady=(0, 22))
        tk.Label(
            brand,
            text="PROTONLAB",
            bg="#081521",
            fg="#ffffff",
            font=("Arial", 20, "bold"),
        ).pack(anchor="w")
        tk.Label(
            brand,
            text="Admin control center",
            bg="#081521",
            fg="#8fb3c9",
            font=("Arial", 10),
        ).pack(anchor="w", pady=(4, 0))

        account = tk.Frame(sidebar, bg="#10273b", padx=14, pady=12, highlightbackground="#1f3b52", highlightthickness=1)
        account.pack(fill="x", pady=(0, 18))
        tk.Label(account, text="Daniela Rojas", bg="#10273b", fg="#ffffff", font=("Arial", 11, "bold")).pack(anchor="w")
        tk.Label(account, text="Admin General", bg="#10273b", fg="#9fbad0", font=("Arial", 9)).pack(anchor="w", pady=(2, 0))
        self._pill(account, "Nivel Root", "#00a8a8").pack(anchor="w", pady=(10, 0))

        tk.Label(
            sidebar,
            text="Navegacion",
            bg="#081521",
            fg="#6f93ab",
            font=("Arial", 9, "bold"),
        ).pack(anchor="w", pady=(0, 10))

        for index, section in enumerate(self.sidebar_sections):
            active = index == 0
            bg = "#12314a" if active else "#081521"
            border = "#1d4e6d" if active else "#081521"
            item = tk.Frame(
                sidebar,
                bg=bg,
                padx=12,
                pady=10,
                highlightbackground=border,
                highlightthickness=1,
                cursor="hand2",
            )
            item.pack(fill="x", pady=(0, 8))
            text_block = tk.Frame(item, bg=bg)
            text_block.pack(side="left", fill="x", expand=True)
            title = tk.Label(
                text_block,
                text=section["title"],
                bg=bg,
                fg="#ffffff",
                font=("Arial", 10, "bold"),
                cursor="hand2",
            )
            title.pack(anchor="w")
            subtitle = tk.Label(
                text_block,
                text=section["subtitle"],
                bg=bg,
                fg="#8fb3c9",
                font=("Arial", 9),
                cursor="hand2",
            )
            subtitle.pack(anchor="w", pady=(2, 0))
            badge_color = "#00a8a8" if active else "#27455c"
            badge = self._pill(item, section["badge"], badge_color)
            badge.configure(cursor="hand2")
            badge.pack(side="right")
            widgets = [item, text_block, title, subtitle, badge]
            for widget in widgets:
                widget.bind(
                    "<Button-1>",
                    lambda _event, name=section["title"]: self.set_active_section(name),
                )
            self.sidebar_items.append(
                {
                    "name": section["title"],
                    "frame": item,
                    "text_block": text_block,
                    "title": title,
                    "subtitle": subtitle,
                    "badge": badge,
                }
            )

        footer = tk.Frame(sidebar, bg="#081521")
        footer.pack(side="bottom", fill="x", pady=(20, 0))
        tk.Label(footer, text="Estado de plataforma", bg="#081521", fg="#6f93ab", font=("Arial", 9, "bold")).pack(anchor="w")
        tk.Label(footer, text="Cloud 99.98% | ERP Sync OK", bg="#081521", fg="#ffffff", font=("Arial", 10)).pack(anchor="w", pady=(6, 0))

    def _build_header(self, parent: tk.Widget) -> None:
        header = tk.Frame(parent, bg="#0b1f33", padx=24, pady=18)
        header.pack(fill="x", pady=(0, 20))

        left = tk.Frame(header, bg="#0b1f33")
        left.pack(side="left")
        tk.Label(
            left,
            text="Protonlab Admin Command",
            bg="#0b1f33",
            fg="#ffffff",
            font=("Arial", 22, "bold"),
        ).pack(anchor="w")
        self.header_subtitle = tk.Label(
            left,
            text="Tecnología de vanguardia para negocio digital, hardware industrial y laboratorios avanzados.",
            bg="#0b1f33",
            fg="#c9d6e2",
            font=("Arial", 11),
        )
        self.header_subtitle.pack(anchor="w", pady=(6, 0))

        right = tk.Frame(header, bg="#0b1f33")
        right.pack(side="right")
        self._pill(right, "Protonlab B2B", "#0ea5e9").pack(anchor="e", pady=(0, 8))
        self.refresh_label = self._pill(right, "Actualizado hace 5 min", "#22c55e")
        self.refresh_label.pack(anchor="e", pady=(0, 8))
        tk.Button(
            right,
            text="Actualizar simulacion",
            command=self.refresh_dashboard,
            bg="#12314a",
            fg="#ffffff",
            activebackground="#1d4e6d",
            activeforeground="#ffffff",
            relief="flat",
            cursor="hand2",
            padx=12,
            pady=7,
            font=("Arial", 9, "bold"),
        ).pack(anchor="e")

    def _build_summary_row(self, parent: tk.Widget) -> None:
        row = tk.Frame(parent, bg="#f3f6fb")
        row.pack(fill="x", pady=(0, 20))

        for title, value in self.summary_cards.items():
            card = tk.Frame(row, bg="#ffffff", padx=18, pady=16, highlightbackground="#d9e2ec", highlightthickness=1)
            card.pack(side="left", fill="x", expand=True, padx=(0, 12))
            tk.Label(card, text=title, bg="#ffffff", fg="#486581", font=("Arial", 10, "bold")).pack(anchor="w")
            tk.Label(card, text=value, bg="#ffffff", fg="#102a43", font=("Arial", 20, "bold")).pack(anchor="w", pady=(8, 4))
        row.winfo_children()[-1].pack_configure(padx=0)

    def _build_main_grid(self, parent: tk.Widget) -> None:
        main = tk.Frame(parent, bg="#f3f6fb")
        main.pack(fill="both", expand=True)

        left = tk.Frame(main, bg="#f3f6fb")
        left.pack(side="left", fill="both", expand=True, padx=(0, 12))
        right = tk.Frame(main, bg="#f3f6fb", width=360)
        right.pack(side="right", fill="y")

        self._build_spotlight_panel(left)
        self._build_sales_panel(left)
        self._build_pipeline_panel(left)
        self._build_tabs_panel(left)
        self._build_alerts_panel(right)
        self._build_activity_panel(right)
        self._build_inventory_panel(right)

    def _build_spotlight_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(
            parent,
            bg="#ffffff",
            padx=18,
            pady=18,
            highlightbackground="#d9e2ec",
            highlightthickness=1,
        )
        panel.pack(fill="x", pady=(0, 20))

        self.spotlight_title = tk.Label(
            panel,
            text="",
            bg="#ffffff",
            fg="#1c2a3a",
            font=("Arial", 14, "bold"),
        )
        self.spotlight_title.pack(anchor="w")
        self.spotlight_description = tk.Label(
            panel,
            text="",
            bg="#ffffff",
            fg="#627d98",
            font=("Arial", 10),
            wraplength=820,
            justify="left",
        )
        self.spotlight_description.pack(anchor="w", pady=(4, 12))
        self.spotlight_highlights = tk.Frame(panel, bg="#ffffff")
        self.spotlight_highlights.pack(fill="x")
        self._render_spotlight()

    def _build_sales_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(parent, bg="#ffffff", padx=18, pady=18, highlightbackground="#d9e2ec", highlightthickness=1)
        panel.pack(fill="x", pady=(0, 20))

        tk.Label(panel, text="Rendimiento Comercial Protonlab", bg="#ffffff", fg="#1c2a3a", font=("Arial", 14, "bold")).pack(anchor="w")
        tk.Label(panel, text="Ingresos mensuales simulados por soluciones digitales, industriales y de laboratorio.", bg="#ffffff", fg="#627d98", font=("Arial", 10)).pack(anchor="w", pady=(4, 14))

        chart = tk.Canvas(panel, height=220, bg="#ffffff", highlightthickness=0)
        chart.pack(fill="x")

        sales = self.dataset["sales"]
        max_revenue = max(item["revenue"] for item in sales)
        width = 900
        height = 210
        margin_x = 24
        base_y = 180
        bar_width = 78
        gap = 58
        chart.configure(width=width, height=height)

        chart.create_line(margin_x, base_y, width - 24, base_y, fill="#bcccdc", width=2)
        for index, item in enumerate(sales):
            x0 = margin_x + index * (bar_width + gap)
            x1 = x0 + bar_width
            bar_height = int((item["revenue"] / max_revenue) * 120)
            y0 = base_y - bar_height
            chart.create_rectangle(x0, y0, x1, base_y, fill="#00a8a8", outline="")
            chart.create_text((x0 + x1) / 2, y0 - 14, text=format_currency(item["revenue"]), fill="#486581", font=("Arial", 9, "bold"))
            chart.create_text((x0 + x1) / 2, base_y + 18, text=item["month"], fill="#334e68", font=("Arial", 10))

    def _build_pipeline_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(parent, bg="#ffffff", padx=18, pady=18, highlightbackground="#d9e2ec", highlightthickness=1)
        panel.pack(fill="x", pady=(0, 20))

        tk.Label(panel, text="Pipeline Comercial", bg="#ffffff", fg="#1c2a3a", font=("Arial", 14, "bold")).pack(anchor="w")
        tk.Label(panel, text="Oportunidades fake para negocio industrial, digital y laboratorio.", bg="#ffffff", fg="#627d98", font=("Arial", 10)).pack(anchor="w", pady=(4, 12))

        columns = ("name", "stage", "value", "owner")
        tree = ttk.Treeview(panel, columns=columns, show="headings", height=4)
        tree.pack(fill="x", expand=True)

        for key, text, width in (
            ("name", "Oportunidad", 300),
            ("stage", "Etapa", 140),
            ("value", "Valor", 130),
            ("owner", "Responsable", 160),
        ):
            tree.heading(key, text=text)
            tree.column(key, anchor="w", width=width)

        for item in self.dataset["pipeline"]:
            tree.insert("", "end", values=(item["name"], item["stage"], item["value"], item["owner"]))

    def _build_tabs_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(parent, bg="#ffffff", padx=10, pady=10, highlightbackground="#d9e2ec", highlightthickness=1)
        panel.pack(fill="both", expand=True)

        self.notebook = ttk.Notebook(panel, style="Tab.TNotebook")
        self.notebook.pack(fill="both", expand=True)

        self.notebook.add(self._orders_tab(self.notebook), text="Pedidos")
        self.notebook.add(self._clients_tab(self.notebook), text="Clientes")
        self.notebook.add(self._users_tab(self.notebook), text="Usuarios")
        self.notebook.add(self._executive_tab(self.notebook), text="Resumen")

    def _orders_tab(self, parent: ttk.Notebook) -> tk.Frame:
        frame = tk.Frame(parent, bg="#ffffff", padx=14, pady=14)
        self._section_header(frame, "Pedidos recientes", "Seguimiento de proyectos, compras técnicas y despachos críticos.").pack(fill="x", pady=(0, 12))

        columns = ("id", "client", "status", "total")
        tree = ttk.Treeview(frame, columns=columns, show="headings", height=8)
        tree.pack(fill="both", expand=True)
        headings = {
            "id": "Pedido",
            "client": "Cliente",
            "status": "Estado",
            "total": "Monto",
        }
        for key, text in headings.items():
            tree.heading(key, text=text)
            tree.column(key, anchor="w", width=140 if key != "client" else 260)

        for order in self.dataset["orders"]:
            tree.insert("", "end", values=(order["id"], order["client"], order["status"], order["total"]))
        return frame

    def _users_tab(self, parent: ttk.Notebook) -> tk.Frame:
        frame = tk.Frame(parent, bg="#ffffff", padx=14, pady=14)
        self._section_header(frame, "Usuarios y roles", "Cobertura del equipo comercial, técnico y operativo de Protonlab.").pack(fill="x", pady=(0, 12))

        columns = ("name", "role", "active")
        tree = ttk.Treeview(frame, columns=columns, show="headings", height=8)
        tree.pack(fill="both", expand=True)

        for key, text, width in (
            ("name", "Nombre", 240),
            ("role", "Rol", 160),
            ("active", "Estado", 120),
        ):
            tree.heading(key, text=text)
            tree.column(key, anchor="w", width=width)

        for user in self.dataset["users"]:
            state = "Activo" if user["active"] else "Inactivo"
            tree.insert("", "end", values=(user["name"], user["role"], state))
        return frame

    def _clients_tab(self, parent: ttk.Notebook) -> tk.Frame:
        frame = tk.Frame(parent, bg="#ffffff", padx=14, pady=14)
        self._section_header(frame, "Clientes estratégicos", "Cuentas fake para validar cartera y foco comercial.").pack(fill="x", pady=(0, 12))

        columns = ("name", "segment", "manager", "mrr")
        tree = ttk.Treeview(frame, columns=columns, show="headings", height=8)
        tree.pack(fill="both", expand=True)

        for key, text, width in (
            ("name", "Cliente", 220),
            ("segment", "Segmento", 140),
            ("manager", "Account Owner", 160),
            ("mrr", "Facturación", 140),
        ):
            tree.heading(key, text=text)
            tree.column(key, anchor="w", width=width)

        for client in self.dataset["clients"]:
            tree.insert("", "end", values=(client["name"], client["segment"], client["manager"], client["mrr"]))
        return frame

    def _executive_tab(self, parent: ttk.Notebook) -> tk.Frame:
        frame = tk.Frame(parent, bg="#ffffff", padx=18, pady=18)
        self._section_header(frame, "Indicadores ejecutivos", "Balance entre crecimiento comercial y continuidad operacional.").pack(fill="x", pady=(0, 16))

        metrics = [
            ("Meta mensual consolidada", 94),
            ("Despachos industriales a tiempo", 88),
            ("Conversión de cotizaciones técnicas", 71),
        ]

        for label, value in metrics:
            row = tk.Frame(frame, bg="#ffffff")
            row.pack(fill="x", pady=8)
            tk.Label(row, text=label, bg="#ffffff", fg="#334e68", font=("Arial", 10, "bold")).pack(anchor="w")
            bar = ttk.Progressbar(row, maximum=100, value=value, length=520)
            bar.pack(fill="x", pady=6)
            tk.Label(row, text=f"{value}%", bg="#ffffff", fg="#486581", font=("Arial", 10)).pack(anchor="e")

        return frame

    def _build_alerts_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(parent, bg="#ffffff", padx=18, pady=18, highlightbackground="#d9e2ec", highlightthickness=1)
        panel.pack(fill="x", pady=(0, 20))
        tk.Label(panel, text="Alertas Operativas", bg="#ffffff", fg="#1c2a3a", font=("Arial", 14, "bold")).pack(anchor="w")
        tk.Label(panel, text="Eventos simulados en líneas digital, industrial y laboratorio.", bg="#ffffff", fg="#627d98", font=("Arial", 10)).pack(anchor="w", pady=(4, 14))

        colors = {"Alta": "#ef4444", "Media": "#f59e0b", "Baja": "#22c55e"}
        for alert in self.dataset["alerts"]:
            card = tk.Frame(panel, bg="#f8fafc", padx=12, pady=10, highlightbackground="#e2e8f0", highlightthickness=1)
            card.pack(fill="x", pady=(0, 10))
            self._pill(card, alert["severity"], colors.get(alert["severity"], "#64748b")).pack(anchor="w")
            tk.Label(card, text=alert["message"], bg="#f8fafc", fg="#334155", font=("Arial", 10), wraplength=280, justify="left").pack(anchor="w", pady=(8, 0))

    def _build_activity_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(parent, bg="#ffffff", padx=18, pady=18, highlightbackground="#d9e2ec", highlightthickness=1)
        panel.pack(fill="x", pady=(0, 20))
        tk.Label(panel, text="Actividad Reciente", bg="#ffffff", fg="#1c2a3a", font=("Arial", 14, "bold")).pack(anchor="w")
        tk.Label(panel, text="Eventos fake para validar cronología operativa.", bg="#ffffff", fg="#627d98", font=("Arial", 10)).pack(anchor="w", pady=(4, 14))

        for item in self.dataset["activity"]:
            row = tk.Frame(panel, bg="#f8fafc", padx=12, pady=10, highlightbackground="#e2e8f0", highlightthickness=1)
            row.pack(fill="x", pady=(0, 8))
            tk.Label(row, text=item["time"], bg="#f8fafc", fg="#00a8a8", font=("Arial", 9, "bold")).pack(anchor="w")
            tk.Label(row, text=item["event"], bg="#f8fafc", fg="#334155", font=("Arial", 10), wraplength=280, justify="left").pack(anchor="w", pady=(4, 0))

    def _build_inventory_panel(self, parent: tk.Widget) -> None:
        panel = tk.Frame(parent, bg="#ffffff", padx=18, pady=18, highlightbackground="#d9e2ec", highlightthickness=1)
        panel.pack(fill="both", expand=True)
        tk.Label(panel, text="Inventario Estratégico", bg="#ffffff", fg="#1c2a3a", font=("Arial", 14, "bold")).pack(anchor="w")
        tk.Label(panel, text="Equipos y licencias priorizados por criticidad operacional.", bg="#ffffff", fg="#627d98", font=("Arial", 10)).pack(anchor="w", pady=(4, 14))

        for item in self.dataset["inventory"]:
            severity = item["stock"] <= item["critical_threshold"]
            bg = "#fff1f2" if severity else "#f8fafc"
            border = "#fecdd3" if severity else "#e2e8f0"
            card = tk.Frame(panel, bg=bg, padx=12, pady=10, highlightbackground=border, highlightthickness=1)
            card.pack(fill="x", pady=(0, 10))
            tk.Label(card, text=item["product"], bg=bg, fg="#0f172a", font=("Arial", 10, "bold")).pack(anchor="w")
            tk.Label(card, text=f"SKU {item['sku']}", bg=bg, fg="#64748b", font=("Arial", 9)).pack(anchor="w", pady=(2, 6))
            tk.Label(
                card,
                text=f"Stock actual: {item['stock']} | Umbral: {item['critical_threshold']}",
                bg=bg,
                fg="#334155",
                font=("Arial", 9),
            ).pack(anchor="w")

    def _pill(self, parent: tk.Widget, text: str, color: str) -> tk.Label:
        return tk.Label(
            parent,
            text=text,
            bg=color,
            fg="#ffffff",
            padx=10,
            pady=4,
            font=("Arial", 9, "bold"),
        )

    def _section_header(self, parent: tk.Widget, title: str, subtitle: str) -> tk.Frame:
        frame = tk.Frame(parent, bg="#ffffff")
        tk.Label(frame, text=title, bg="#ffffff", fg="#1c2a3a", font=("Arial", 13, "bold")).pack(anchor="w")
        tk.Label(frame, text=subtitle, bg="#ffffff", fg="#627d98", font=("Arial", 10)).pack(anchor="w", pady=(4, 0))
        return frame

    def _on_content_configure(self, _event: tk.Event) -> None:
        self.content_canvas.configure(scrollregion=self.content_canvas.bbox("all"))

    def _on_canvas_configure(self, event: tk.Event) -> None:
        self.content_canvas.itemconfigure(self.content_canvas_window, width=event.width)

    def _bind_mousewheel(self, widget: tk.Widget) -> None:
        widget.bind("<MouseWheel>", self._on_mousewheel)
        widget.bind("<Button-4>", self._on_mousewheel)
        widget.bind("<Button-5>", self._on_mousewheel)

    def _on_mousewheel(self, event: tk.Event) -> None:
        config = build_scroll_config()
        step = int(config["mousewheel_step"])
        if getattr(event, "num", None) == 4:
            delta = -1
        elif getattr(event, "num", None) == 5:
            delta = 1
        else:
            raw_delta = getattr(event, "delta", 0)
            delta = -1 if raw_delta > 0 else 1
        self.content_canvas.yview_scroll(delta * step, "units")

    def _render_spotlight(self) -> None:
        snapshot = build_section_snapshot(self.active_section, self.dataset)
        self.spotlight_title.configure(text=snapshot["title"])
        self.spotlight_description.configure(text=snapshot["description"])

        for child in self.spotlight_highlights.winfo_children():
            child.destroy()

        for highlight in snapshot["highlights"]:
            row = tk.Frame(
                self.spotlight_highlights,
                bg="#f8fafc",
                padx=12,
                pady=8,
                highlightbackground="#e2e8f0",
                highlightthickness=1,
            )
            row.pack(fill="x", pady=(0, 8))
            tk.Label(
                row,
                text=highlight,
                bg="#f8fafc",
                fg="#334155",
                font=("Arial", 10),
                anchor="w",
            ).pack(anchor="w")

    def _update_sidebar_state(self) -> None:
        for item in self.sidebar_items:
            active = item["name"] == self.active_section
            bg = "#12314a" if active else "#081521"
            border = "#1d4e6d" if active else "#081521"
            badge_bg = "#00a8a8" if active else "#27455c"

            item["frame"].configure(bg=bg, highlightbackground=border)
            item["text_block"].configure(bg=bg)
            item["title"].configure(bg=bg)
            item["subtitle"].configure(bg=bg)
            item["badge"].configure(bg=badge_bg)

    def set_active_section(self, section_name: str) -> None:
        self.active_section = section_name
        self._update_sidebar_state()
        self._render_spotlight()

        snapshot = build_section_snapshot(section_name, self.dataset)
        self.header_subtitle.configure(text=snapshot["description"])

        tab_map = {
            "Pedidos": 0,
            "Clientes": 1,
            "Configuracion": 2,
            "Inventario": 3,
            "Laboratorio": 3,
            "Industrial": 3,
            "Resumen": 3,
            "Ventas": 3,
        }
        self.notebook.select(tab_map.get(section_name, 2))

    def refresh_dashboard(self) -> None:
        self.refresh_count += 1
        minutes = 5 + self.refresh_count
        self.refresh_label.configure(text=f"Actualizado hace {minutes} min")
        snapshot = build_section_snapshot(self.active_section, self.dataset)
        self.header_subtitle.configure(
            text=f"{snapshot['description']} | Sincronizacion #{self.refresh_count}"
        )


def main() -> None:
    app = AdminDashboardMockup()
    app.mainloop()


if __name__ == "__main__":
    main()
