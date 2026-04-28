"""Assemble the Lamen Microfinance app overview .pptx deck."""
from datetime import date
from pathlib import Path

from PIL import Image
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Emu, Inches, Pt

SHOTS_DIR = Path("attached_assets/ppt_screenshots")
OUT_PATH = Path("exports/lamen-app-overview.pptx")
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

LAMEN_GREEN = RGBColor(0x16, 0xA3, 0x4A)
LAMEN_GREEN_DARK = RGBColor(0x0F, 0x76, 0x36)
DARK_TEXT = RGBColor(0x1F, 0x29, 0x37)
MUTED_TEXT = RGBColor(0x55, 0x65, 0x72)
LIGHT_BG = RGBColor(0xF7, 0xFA, 0xF8)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)


def add_filled_rect(slide, left, top, width, height, fill, line=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill
    if line is None:
        shape.line.fill.background()
    else:
        shape.line.color.rgb = line
        shape.line.width = Pt(0.75)
    shape.shadow.inherit = False
    return shape


def add_text(slide, left, top, width, height, text, *,
             size=14, bold=False, color=DARK_TEXT, align=PP_ALIGN.LEFT,
             anchor=MSO_ANCHOR.TOP, font="Calibri"):
    tb = slide.shapes.add_textbox(left, top, width, height)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Emu(0)
    tf.margin_top = tf.margin_bottom = Emu(0)
    tf.vertical_anchor = anchor
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.name = font
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    return tb


def add_image_fit(slide, image_path, left, top, max_width, max_height,
                  border_color=RGBColor(0xE2, 0xE8, 0xF0)):
    """Place an image keeping aspect ratio inside the given box.
    A subtle border rectangle is drawn behind it."""
    with Image.open(image_path) as im:
        iw, ih = im.size
    box_w = float(max_width)
    box_h = float(max_height)
    scale = min(box_w / iw, box_h / ih)
    w = int(iw * scale)
    h = int(ih * scale)
    cx = float(left) + box_w / 2
    cy = float(top) + box_h / 2
    img_left = int(cx - w / 2)
    img_top = int(cy - h / 2)
    # Border background
    border = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        img_left - Emu(9525), img_top - Emu(9525),
        w + Emu(19050), h + Emu(19050),
    )
    border.fill.solid()
    border.fill.fore_color.rgb = WHITE
    border.line.color.rgb = border_color
    border.line.width = Pt(0.75)
    border.shadow.inherit = False
    slide.shapes.add_picture(str(image_path), img_left, img_top, width=w, height=h)


def add_title_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    # Full background
    add_filled_rect(slide, 0, 0, SLIDE_W, SLIDE_H, LIGHT_BG)
    # Left green panel
    add_filled_rect(slide, 0, 0, Inches(5.0), SLIDE_H, LAMEN_GREEN_DARK)
    # Decorative accent bar
    add_filled_rect(slide, Inches(5.0), 0, Inches(0.12), SLIDE_H, LAMEN_GREEN)

    # Brand mark inside green panel
    add_text(
        slide, Inches(0.6), Inches(0.6), Inches(4.0), Inches(0.6),
        "LAMEN MICROFINANCE", size=18, bold=True, color=WHITE,
    )
    add_text(
        slide, Inches(0.6), Inches(1.1), Inches(4.0), Inches(0.4),
        "Islamic Finance \u2022 Accounting \u2022 HR", size=12, color=WHITE,
    )

    # Title block on right
    add_text(
        slide, Inches(5.6), Inches(2.1), Inches(7.3), Inches(1.2),
        "Loan Management System", size=44, bold=True, color=DARK_TEXT,
    )
    add_text(
        slide, Inches(5.6), Inches(3.1), Inches(7.3), Inches(0.6),
        "Product Overview", size=24, color=LAMEN_GREEN_DARK,
    )
    add_text(
        slide, Inches(5.6), Inches(3.8), Inches(7.3), Inches(2.2),
        "An end-to-end platform for Shariah-compliant microfinance: customer "
        "onboarding, Murabaha financing, disbursements and collections, full "
        "double-entry accounting, DAB regulatory reporting, and a complete HR "
        "module \u2014 plus a field officer mobile app.",
        size=14, color=MUTED_TEXT,
    )

    add_text(
        slide, Inches(5.6), Inches(6.5), Inches(7.3), Inches(0.4),
        date.today().strftime("%B %Y"),
        size=12, color=MUTED_TEXT,
    )


def add_section_divider(prs, eyebrow, title, blurb):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_filled_rect(slide, 0, 0, SLIDE_W, SLIDE_H, LIGHT_BG)
    add_filled_rect(slide, 0, Inches(2.6), SLIDE_W, Inches(2.4), WHITE)
    add_filled_rect(slide, 0, Inches(2.6), Inches(0.18), Inches(2.4), LAMEN_GREEN)
    add_text(
        slide, Inches(0.8), Inches(2.85), Inches(11.7), Inches(0.45),
        eyebrow.upper(), size=14, bold=True, color=LAMEN_GREEN_DARK,
    )
    add_text(
        slide, Inches(0.8), Inches(3.3), Inches(11.7), Inches(0.9),
        title, size=40, bold=True, color=DARK_TEXT,
    )
    add_text(
        slide, Inches(0.8), Inches(4.25), Inches(11.7), Inches(0.7),
        blurb, size=16, color=MUTED_TEXT,
    )


def add_content_slide(prs, title, image_path, description, *, section_label=""):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_filled_rect(slide, 0, 0, SLIDE_W, SLIDE_H, WHITE)
    # Header bar
    add_filled_rect(slide, 0, 0, SLIDE_W, Inches(1.0), LIGHT_BG)
    add_filled_rect(slide, 0, Inches(1.0), SLIDE_W, Inches(0.04), LAMEN_GREEN)
    if section_label:
        add_text(
            slide, Inches(0.6), Inches(0.18), Inches(12), Inches(0.32),
            section_label.upper(), size=11, bold=True, color=LAMEN_GREEN_DARK,
        )
    add_text(
        slide, Inches(0.6), Inches(0.45), Inches(12), Inches(0.5),
        title, size=24, bold=True, color=DARK_TEXT,
    )

    # Image area (left ~ 8.4", description right ~ 4.0")
    img_left = Inches(0.5)
    img_top = Inches(1.35)
    img_w = Inches(8.6)
    img_h = Inches(5.7)
    add_image_fit(slide, image_path, img_left, img_top, img_w, img_h)

    # Description panel (right)
    desc_left = Inches(9.4)
    desc_top = Inches(1.5)
    desc_w = Inches(3.5)
    desc_h = Inches(5.5)
    add_filled_rect(slide, desc_left, desc_top, desc_w, desc_h, LIGHT_BG)
    add_filled_rect(slide, desc_left, desc_top, Inches(0.08), desc_h, LAMEN_GREEN)
    add_text(
        slide, desc_left + Inches(0.25), desc_top + Inches(0.3),
        desc_w - Inches(0.45), Inches(0.45),
        "WHAT THIS SCREEN DOES", size=10, bold=True, color=LAMEN_GREEN_DARK,
    )
    tb = slide.shapes.add_textbox(
        desc_left + Inches(0.25), desc_top + Inches(0.8),
        desc_w - Inches(0.45), desc_h - Inches(1.0),
    )
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Emu(0)
    tf.margin_top = tf.margin_bottom = Emu(0)
    first = True
    for line in description:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.alignment = PP_ALIGN.LEFT
        p.space_after = Pt(8)
        run = p.add_run()
        run.text = line
        run.font.size = Pt(12)
        run.font.color.rgb = DARK_TEXT
        run.font.name = "Calibri"

    # Footer
    add_text(
        slide, Inches(0.6), Inches(7.1), Inches(12), Inches(0.3),
        "Lamen Microfinance \u2022 Loan Management System",
        size=9, color=MUTED_TEXT,
    )


def add_mobile_content_slide(prs, title, image_path, description, *, section_label="Mobile"):
    """Mobile screenshots are tall/narrow, give them a centered portrait area."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_filled_rect(slide, 0, 0, SLIDE_W, SLIDE_H, WHITE)
    add_filled_rect(slide, 0, 0, SLIDE_W, Inches(1.0), LIGHT_BG)
    add_filled_rect(slide, 0, Inches(1.0), SLIDE_W, Inches(0.04), LAMEN_GREEN)
    add_text(
        slide, Inches(0.6), Inches(0.18), Inches(12), Inches(0.32),
        section_label.upper(), size=11, bold=True, color=LAMEN_GREEN_DARK,
    )
    add_text(
        slide, Inches(0.6), Inches(0.45), Inches(12), Inches(0.5),
        title, size=24, bold=True, color=DARK_TEXT,
    )

    # Mobile image centered on left half
    add_image_fit(slide, image_path, Inches(1.5), Inches(1.4), Inches(4.5), Inches(5.7))

    # Description panel right
    desc_left = Inches(7.0)
    desc_top = Inches(1.5)
    desc_w = Inches(5.8)
    desc_h = Inches(5.5)
    add_filled_rect(slide, desc_left, desc_top, desc_w, desc_h, LIGHT_BG)
    add_filled_rect(slide, desc_left, desc_top, Inches(0.08), desc_h, LAMEN_GREEN)
    add_text(
        slide, desc_left + Inches(0.3), desc_top + Inches(0.3),
        desc_w - Inches(0.55), Inches(0.4),
        "WHAT THIS SCREEN DOES", size=10, bold=True, color=LAMEN_GREEN_DARK,
    )
    tb = slide.shapes.add_textbox(
        desc_left + Inches(0.3), desc_top + Inches(0.8),
        desc_w - Inches(0.55), desc_h - Inches(1.0),
    )
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Emu(0)
    first = True
    for line in description:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.space_after = Pt(8)
        run = p.add_run()
        run.text = line
        run.font.size = Pt(13)
        run.font.color.rgb = DARK_TEXT
        run.font.name = "Calibri"

    add_text(
        slide, Inches(0.6), Inches(7.1), Inches(12), Inches(0.3),
        "Lamen Microfinance \u2022 Field Officer Mobile App",
        size=9, color=MUTED_TEXT,
    )


def add_closing_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_filled_rect(slide, 0, 0, SLIDE_W, SLIDE_H, LAMEN_GREEN_DARK)
    # Header
    add_text(
        slide, Inches(0.8), Inches(0.8), Inches(11.7), Inches(0.6),
        "ONE PLATFORM, FROM ONBOARDING TO REGULATORY REPORTING",
        size=14, bold=True, color=WHITE,
    )
    add_text(
        slide, Inches(0.8), Inches(1.4), Inches(11.7), Inches(1.1),
        "Why Lamen Microfinance",
        size=40, bold=True, color=WHITE,
    )

    # Pillar cards
    pillars = [
        ("Shariah-compliant Lifecycle",
         "End-to-end Murabaha origination: application, FAD review, risk & compliance, "
         "committee voting, disbursement, repayment scheduling and PAR tracking."),
        ("Built-in Accounting",
         "Full chart of accounts, journal entries, trial balance, income statement, "
         "balance sheet and cash flow \u2014 with branch-level dimensions."),
        ("Regulatory & Risk",
         "DAB reports, loan classification, citizen balance statements, LCTR and a "
         "library of operational and shareholder reports out of the box."),
        ("HR & Workforce",
         "Employees, departments, attendance, leave, payroll, recruitment, performance "
         "reviews and training in the same workspace."),
        ("Field Officer Mobile App",
         "Officers can review active financing, file new applications, and record "
         "collections from any phone \u2014 with the same auth and data model."),
        ("Branches, Roles & Permissions",
         "Multi-branch operation with granular page permissions, user management and "
         "an audit-friendly activity log."),
    ]
    cols = 3
    card_w = Inches(3.95)
    card_h = Inches(2.1)
    gap_x = Inches(0.18)
    gap_y = Inches(0.25)
    start_x = Inches(0.6)
    start_y = Inches(2.7)
    for idx, (head, body) in enumerate(pillars):
        r = idx // cols
        c = idx % cols
        left = start_x + (card_w + gap_x) * c
        top = start_y + (card_h + gap_y) * r
        add_filled_rect(slide, left, top, card_w, card_h, WHITE)
        add_filled_rect(slide, left, top, Inches(0.08), card_h, LAMEN_GREEN)
        add_text(
            slide, left + Inches(0.25), top + Inches(0.2),
            card_w - Inches(0.45), Inches(0.5),
            head, size=15, bold=True, color=DARK_TEXT,
        )
        add_text(
            slide, left + Inches(0.25), top + Inches(0.75),
            card_w - Inches(0.45), card_h - Inches(0.85),
            body, size=11, color=MUTED_TEXT,
        )

    add_text(
        slide, Inches(0.8), Inches(7.1), Inches(11.7), Inches(0.3),
        "Lamen Microfinance Loan Management System",
        size=10, color=WHITE,
    )


# ---------------------------------------------------------------------------
# Slide content definitions
# ---------------------------------------------------------------------------

CONTENT = [
    # (slug, section, title, [description lines])
    ("01_dashboard", "Operations",
     "Operational Dashboard",
     [
         "Daily cash position with KPIs for portfolio, collections, "
         "disbursements and PAR.",
         "Live tiles for applications received, approved, rejected and "
         "amounts disbursed today, plus installments due and missed.",
     ]),
    ("02_customers", "Operations",
     "Customers",
     [
         "Master register of all customers with branch, sector, contact "
         "and KYC details.",
         "Search, filter and drill into a customer to view their financing "
         "history and outstanding balances.",
     ]),
    ("03_loan_application", "Operations",
     "New Loan Application",
     [
         "Multi-step Murabaha application capturing customer, financing "
         "details, business profile, collateral, guarantors and documents.",
         "Auto-generates the customer number and routes the file into the "
         "credit committee workflow.",
     ]),
    ("04_loans", "Operations",
     "Loans / Financing Portfolio",
     [
         "Unified view of every Murabaha contract across all branches "
         "with status, principal, margin and outstanding balance.",
         "Quick actions to open contracts, record events and export the "
         "active portfolio.",
     ]),
    ("05_financing_products", "Operations",
     "Financing Products",
     [
         "Configure the Murabaha product catalog \u2014 tenor, margin "
         "rate, repayment frequency and eligibility rules.",
         "Used as the source of truth when officers create new "
         "applications.",
     ]),
    ("06_disbursements", "Operations",
     "Disbursements Queue",
     [
         "Shows approved contracts waiting to be disbursed, with the "
         "amount, customer and target disbursement date.",
         "Officers post the disbursement, which automatically books the "
         "matching journal entries and updates the portfolio.",
     ]),
    ("07_collections", "Operations",
     "Collections",
     [
         "Daily collection workspace for officers \u2014 filter by "
         "branch and date to find installments due.",
         "Record cash, bank and HQ collections in one click; amounts "
         "flow into the cash position and ledgers immediately.",
     ]),
    ("09_accounting_dashboard", "Accounting",
     "Accounting Dashboard",
     [
         "At-a-glance view of total assets, liabilities, equity, revenue "
         "and expenses across the institution.",
         "Drills into the underlying ledgers, journals and statements "
         "from a single entry point.",
     ]),
    ("10_chart_of_accounts", "Accounting",
     "Chart of Accounts",
     [
         "Hierarchical chart of accounts aligned to DAB and IFRS "
         "categories \u2014 assets, liabilities, equity, revenue, expense.",
         "Add and reorganize accounts, control posting rules and view "
         "running balances per account.",
     ]),
    ("11_journal_entries", "Accounting",
     "Journal Entries",
     [
         "Capture and review every double-entry journal posted by the "
         "system or by accountants manually.",
         "Search by date, account, reference or branch and export to "
         "Excel for reconciliation.",
     ]),
    ("13_income_statement", "Accounting",
     "Income Statement",
     [
         "Profit & loss for any period, with revenue, cost of financing "
         "and operating expenses broken down by category.",
         "Compare across periods and branches to evaluate "
         "profitability.",
     ]),
    ("14_balance_sheet", "Accounting",
     "Balance Sheet",
     [
         "Statement of financial position at a chosen reporting date.",
         "Groups assets, liabilities and equity per IFRS and feeds "
         "directly into the DAB regulatory pack.",
     ]),

    ("15_dab_reports", "Regulatory",
     "DAB Regulatory Reports",
     [
         "One-click pack of the reports required by Da Afghanistan Bank "
         "for microfinance institutions.",
         "Generates standardized exports for portfolio quality, "
         "classification, large transactions and prudential limits.",
     ]),

    ("16_hr_dashboard", "HR",
     "HR Dashboard",
     [
         "Workforce overview \u2014 headcount, gender mix, employment "
         "type and branch distribution.",
         "Summarizes payroll, leave and performance so HR can spot "
         "issues before they escalate.",
     ]),
    ("17_hr_employees", "HR",
     "Employees",
     [
         "Employee register with personal, contractual and "
         "compensation information.",
         "Add new staff, edit profiles, attach documents and link "
         "employees to branches and positions.",
     ]),
    ("18_hr_attendance", "HR",
     "Attendance",
     [
         "Daily attendance grid showing clock-in / clock-out, late "
         "arrivals and absences by branch.",
         "Feeds straight into payroll calculations and leave "
         "balances.",
     ]),
    ("20_hr_payroll", "HR",
     "Payroll",
     [
         "Run monthly payroll across branches with earnings, "
         "deductions and benefits.",
         "Posts the payroll journal automatically and produces "
         "payslips ready to share.",
     ]),
    ("21_hr_recruitment", "HR",
     "Recruitment",
     [
         "Pipeline of open positions, candidates and interview "
         "stages.",
         "Hire approved candidates straight into the employee module "
         "without rekeying data.",
     ]),
    ("22_hr_performance", "HR",
     "Performance",
     [
         "Review cycles, goals and ratings per employee and "
         "department.",
         "Surfaces ratings on the HR dashboard so management has a "
         "live view of workforce performance.",
     ]),

    ("23_admin_dashboard", "Admin",
     "Admin Dashboard",
     [
         "Executive view combining HR staffing, sector exposure and "
         "branch productivity.",
         "Includes disbursement target progress so management can "
         "track plan vs. actuals.",
     ]),
    ("24_users", "Admin",
     "Users",
     [
         "Manage system users \u2014 create accounts, assign branches "
         "and reset passwords.",
         "Activate or deactivate users without losing the audit trail "
         "of their actions.",
     ]),
    ("26_branches", "Admin",
     "Branches",
     [
         "Maintain the institution's branch network \u2014 names, "
         "regions, codes and operational status.",
         "Branch is a first-class dimension across loans, accounting, "
         "HR and reports.",
     ]),
    ("27_activity", "Admin",
     "Activity Log",
     [
         "Full audit log of user actions across the platform with "
         "timestamps and source IP.",
         "Filter by user, action or entity to investigate issues or "
         "satisfy compliance reviews.",
     ]),
]

MOBILE_CONTENT = [
    ("28_mobile_customers", "Mobile",
     "Mobile \u2014 Active Financing",
     [
         "Field officers see all active Murabaha contracts assigned "
         "to them with a quick repayment progress bar.",
         "Tabs for Active, Pending, Approved, Completed and All make "
         "it easy to triage from the field.",
         "Tap any customer to view their full contract details.",
     ]),
    ("30_mobile_collections", "Mobile",
     "Mobile \u2014 Collections",
     [
         "Lists today's installments due so officers can confirm and "
         "record collections on the spot.",
         "Recorded payments sync back into the collections, journal "
         "and dashboards in real time.",
     ]),
]


def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H

    # Title
    add_title_slide(prs)

    sections = [
        ("Operations",
         "Customers, Loans & Daily Operations",
         "From customer onboarding through Murabaha origination, disbursement "
         "and daily collections."),
        ("Accounting",
         "Full Double-Entry Accounting",
         "Chart of accounts, journals and the complete financial statement set."),
        ("Regulatory",
         "Regulatory Reporting",
         "DAB-aligned regulatory reports generated from live ledger and "
         "portfolio data."),
        ("HR",
         "Human Resources",
         "Employees, attendance, leave, payroll, recruitment and performance "
         "in one place."),
        ("Admin",
         "Administration & Configuration",
         "Branches, users, role-based permissions and activity logs that keep "
         "the institution running safely."),
        ("Mobile",
         "Field Officer Mobile App",
         "Active financing, new applications and collections from any phone."),
    ]
    section_blurbs = {s[0]: s for s in sections}

    last_section = None
    for slug, section, title, desc in CONTENT:
        if section != last_section:
            _, sec_title, sec_blurb = section_blurbs[section]
            add_section_divider(prs, section, sec_title, sec_blurb)
            last_section = section
        img = SHOTS_DIR / f"{slug}.png"
        add_content_slide(prs, title, img, desc, section_label=section)

    # Mobile divider + slides
    if MOBILE_CONTENT:
        _, sec_title, sec_blurb = section_blurbs["Mobile"]
        add_section_divider(prs, "Mobile", sec_title, sec_blurb)
        for slug, section, title, desc in MOBILE_CONTENT:
            img = SHOTS_DIR / f"{slug}.png"
            add_mobile_content_slide(prs, title, img, desc, section_label=section)

    add_closing_slide(prs)
    prs.save(OUT_PATH)
    print(f"Wrote {OUT_PATH}", flush=True)


if __name__ == "__main__":
    build()
