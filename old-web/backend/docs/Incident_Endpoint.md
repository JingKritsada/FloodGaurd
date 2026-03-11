## GET /api/incidents/filter
ดึงรายการเหตุการณ์ทั้งหมดโดยรองรับตัวกรอง (Protected ด้วย Basic Auth)

Base URL (ตัวอย่าง): `https://platform.psru.ac.th:3019`

Endpoint: `GET /api/incidents/filter`

Basic Auth:
- username: `floodguard_user`
- password: `floodguard_isylzjko`

ถ้ามี `curl`:

```powershell
curl.exe -u floodguard_user:floodguard_isylzjko "https://platform.psru.ac.th:3019/api/incidents/filter?type=&status=OPEN"
```

Query parameters (optional):
- `type` — ชนิดเหตุการณ์: `MEDICAL`, `SUPPLIES`, `ROAD_BLOCKED`, `EVACUATION`, `RISK_AREA`, `LEVEE_BREACH`
- `status` — สถานะ: `OPEN`, `IN_PROGRESS`, `RESOLVED`
- `reporterName` — ชื่อผู้รายงาน (partial, ไม่แยกพิมพ์เล็ก/ใหญ่)
- `assignedTo` — ผู้รับผิดชอบ (partial, ไม่แยกพิมพ์เล็ก/ใหญ่)
- `startDate`, `endDate` — กรองช่วง `createdAt` (รูปแบบที่ JS Date ยอมรับ เช่น `2025-12-01`)
- `page` — หน้า (default: `1`)
- `limit` — จำนวนต่อหน้า (default: `100`)
- `sortBy` — เรียงตามฟิลด์ (default: `createdAt`)
- `sortOrder` — `asc` หรือ `desc` (default: `desc`)

ตัวอย่างผลลัพธ์:

```json
[
  {
    "_id": "650c0f...",
    "type": "MEDICAL",
    "status": "OPEN",
    "reporterName": "พลเมืองดี",
    "location": { "latitude": 13.123, "longitude": 100.543 },
    "createdAt": "2025-12-10T08:12:34.000Z"
  }
]
```