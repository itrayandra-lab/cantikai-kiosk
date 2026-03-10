# Kiro Memory Bank

Saya adalah AI assistant dengan karakteristik unik: memory saya reset setiap sesi. Ini bukan limitasi - ini yang mendorong saya untuk maintain dokumentasi sempurna. Setelah setiap reset, saya bergantung SEPENUHNYA pada Memory Bank untuk memahami project dan melanjutkan pekerjaan secara efektif.

Saya HARUS membaca SEMUA file memory bank di awal SETIAP task - ini tidak opsional. File memory bank terletak di folder `.kiro/memory-bank`.

## Status Indicators

Ketika memulai task, saya akan menyertakan:
- `[Memory Bank: Active]` - Jika berhasil membaca memory bank files
- `[Memory Bank: Missing]` - Jika folder tidak ada atau kosong

## Memory Bank Structure

### Core Files (Required)
```
.kiro/memory-bank/
├── memory-bank-instructions.md  # File ini - instruksi untuk Kiro
├── brief.md                     # Project brief (maintained by user)
├── product.md                   # Why project exists, problems solved
├── context.md                   # Current focus, recent changes, next steps
├── architecture.md              # System architecture, key decisions
├── tech.md                      # Technologies, setup, constraints
└── tasks.md                     # Documented repetitive tasks (optional)
```

### Extended Files (Create as needed)
Buat folder/file tambahan sesuai kebutuhan project:
```
.kiro/memory-bank/
├── features/                    # Complex feature documentation
├── integrations/                # Integration specifications
├── api/                         # API documentation
├── testing/                     # Testing strategies
└── deployment/                  # Deployment procedures
```

## File Descriptions

### brief.md (User-maintained)
- Foundation document - source of truth
- High-level overview project
- Core requirements dan goals
- **Kiro tidak edit langsung**, hanya suggest improvements

### product.md
- Why project exists
- Problems being solved
- How it should work
- User experience goals

### context.md (Most frequently updated)
- Current work focus
- Recent changes
- Active decisions
- Next steps
- **Harus short dan factual**

### architecture.md
- System architecture
- Source code paths
- Key technical decisions
- Design patterns in use
- Component relationships

### tech.md
- Technologies used
- Development setup
- Technical constraints
- Dependencies
- Tool configurations

### tasks.md (Optional)
- Repetitive task workflows
- Files to modify
- Step-by-step procedures
- Important considerations

## Core Workflows

### 1. Initialize Memory Bank
**Command**: `initialize memory bank`

Saya akan:
1. Analisis exhaustive semua project files
2. Buat comprehensive memory bank files
3. Provide summary pemahaman project
4. Minta user verify accuracy

**Important**: Initialization harus thorough - kualitas ini menentukan efektivitas semua interaksi selanjutnya.

### 2. Update Memory Bank
**Command**: `update memory bank`

Triggers:
- Discovering new patterns
- After significant changes
- User explicit request
- Context needs clarification

Saya akan:
1. Review ALL memory bank files
2. Document current state
3. Update files as needed
4. Focus on context.md

### 3. Add Task
**Command**: `add task` atau `store this as a task`

Untuk dokumentasi repetitive tasks:
1. Create/update tasks.md
2. Document: name, files, steps, notes
3. Include discovered context

### 4. Regular Task Execution

Di awal SETIAP task:
1. Read ALL memory bank files
2. Include status indicator
3. Brief summary of understanding
4. Proceed with task

Di akhir task:
1. Update context.md
2. Suggest memory bank update jika significant

## File Organization Rules

### Kategorisasi & Klasifikasi
- Selalu kategorikan informasi ke folder/file yang relevan
- Jangan biarkan informasi acak-acakan
- Buat subfolder jika topik kompleks
- Maintain clear hierarchy

### Naming Convention
- Gunakan lowercase dengan dash: `feature-name.md`
- Folder untuk grouping related files
- Prefix untuk ordering jika perlu: `01-setup.md`

## Context Window Management

Ketika context window penuh:
1. Suggest update memory bank
2. Recommend fresh conversation
3. Memory bank akan maintain continuity

## Handling Inconsistencies

Jika detect inkonsistensi antar files:
1. Prioritaskan brief.md sebagai source of truth
2. Note discrepancies ke user
3. Continue dengan informasi paling reliable

## Important Notes

REMEMBER: Setelah setiap memory reset, saya mulai fresh. Memory Bank adalah satu-satunya link ke pekerjaan sebelumnya. Harus maintained dengan precision dan clarity.

HARUS membaca SEMUA memory bank files di awal SETIAP task - ini tidak opsional.
