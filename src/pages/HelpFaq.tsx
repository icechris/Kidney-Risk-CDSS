import { useState } from 'react'
import { ChevronDown, Code2, FileText, PlayCircle, Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type Faq = { id: string; question: string; answer: string }
type FaqGroup = { category: string; items: Faq[] }

const faqGroups: FaqGroup[] = [
  {
    category: 'Getting Started',
    items: [
      {
        id: 'q1',
        question: 'How do I override population prior parameters?',
        answer:
          'Authorized clinicians can alter the baseline renal probability coefficients on the "New Assessment" panel. These override variables adjust local model outputs to better reflect sub-population risk profiles.',
      },
      {
        id: 'q2',
        question: 'What metrics calculate the Bayesian Slope?',
        answer:
          'The Bayesian slope is derived from sequential eGFR readings weighted by a posterior distribution over decline rate, updated each time a new lab result is ingested.',
      },
      {
        id: 'q3',
        question: 'Is the CDSS output legally binding?',
        answer:
          'No. All risk scores are decision-support only and must be reviewed by a licensed clinician before any clinical action is taken.',
      },
      {
        id: 'q4',
        question: 'How is creatinine progression flagged?',
        answer:
          'A flag is raised when serum creatinine rises more than 0.3 mg/dL above the patient baseline within a 48-hour rolling window, consistent with AKI staging criteria.',
      },
    ],
  },
  {
    category: 'Risk Model & Bayesian Methods',
    items: [
      {
        id: 'q5',
        question: 'Which classifier powers the default risk score?',
        answer:
          'The platform ships with a Naive Bayes classifier by default. Administrators can switch to a Bayesian logistic regression or Gaussian process classifier from System Settings.',
      },
      {
        id: 'q6',
        question: 'What does the credible interval represent?',
        answer:
          'The credible interval (default 95%) expresses the range in which the true posterior risk probability is expected to fall, given the observed lab history.',
      },
    ],
  },
  {
    category: 'Account & Security',
    items: [
      {
        id: 'q7',
        question: 'How do I reset a forgotten password?',
        answer:
          'Use the "Forgot Password?" link on the sign-in screen. A reset link is sent to your institutional email and expires after 30 minutes.',
      },
      {
        id: 'q8',
        question: 'Is patient data encrypted at rest?',
        answer:
          'Yes. All patient records are encrypted at rest using AES-256 and in transit using TLS 1.3, in line with HIPAA technical safeguards.',
      },
    ],
  },
]

const resources = [
  { icon: FileText, title: 'User Guide PDF', desc: 'Download comprehensive software manual.' },
  { icon: PlayCircle, title: 'Video Tutorials', desc: 'Renal progression workflow walkthroughs.' },
  { icon: Code2, title: 'API Documentation', desc: 'Developer guidelines for EHR connection.' },
]

export default function HelpFaq() {
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>('q1')

  const query = search.trim().toLowerCase()
  const filteredGroups = faqGroups
    .map((group) => ({
      ...group,
      items: query
        ? group.items.filter(
            (item) =>
              item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
          )
        : group.items,
    }))
    .filter((group) => group.items.length > 0)

  return (
    <AppShell title="Documentation & Help Center" subtitle="Clinical Guides · Bayesian Formulas Explained">
      <div className="flex flex-1 flex-col gap-6">
        <Card className="flex items-center gap-4 p-5">
          <Search className="size-5 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search standard clinical FAQs, model equations, or validation papers..."
            className="w-full text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </Card>

        <div className="flex flex-1 items-start gap-6">
          <Card className="flex min-w-0 flex-1 flex-col gap-5 p-6">
            <p className="text-[16px] font-bold text-slate-900">Frequently Asked Questions</p>
            {filteredGroups.length === 0 && (
              <p className="text-sm text-slate-400">No results match "{search}".</p>
            )}
            {filteredGroups.map((group) => (
              <div key={group.category} className="flex flex-col gap-3">
                <p className="text-xs font-bold uppercase text-blue-600">
                  {group.category} ({group.items.length} items)
                </p>
                {group.items.map((item) => {
                  const isOpen = openId === item.id
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex flex-col gap-2.5 rounded-md border border-slate-200 p-3',
                        isOpen ? 'bg-slate-50' : 'bg-white',
                      )}
                    >
                      <button
                        onClick={() => setOpenId(isOpen ? null : item.id)}
                        className="flex w-full items-center justify-between gap-3 text-left"
                      >
                        <p className="text-[13px] font-bold text-slate-900">{item.question}</p>
                        <ChevronDown
                          className={cn(
                            'size-3.5 shrink-0 text-slate-400 transition-transform',
                            isOpen && 'rotate-180',
                          )}
                        />
                      </button>
                      {isOpen && (
                        <p className="text-xs leading-relaxed text-slate-600">{item.answer}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </Card>

          <div className="flex w-[380px] shrink-0 flex-col gap-4">
            <Card className="flex flex-col gap-4 p-5">
              <p className="text-sm font-bold text-slate-900">Quick Reference Resources</p>
              {resources.map((r) => (
                <button
                  key={r.title}
                  className="flex flex-col items-start gap-1 rounded-md bg-slate-50 p-3 text-left hover:bg-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <r.icon className="size-3.5 text-blue-600" />
                    <p className="text-[13px] font-bold text-blue-600">{r.title}</p>
                  </div>
                  <p className="text-[11px] text-slate-600">{r.desc}</p>
                </button>
              ))}
            </Card>

            <Card className="flex flex-col gap-3 border-none bg-emerald-50 p-5">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-600" />
                <p className="text-[13px] font-bold text-emerald-600">CDSS System Status</p>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-900">
                All Bayesian predictive models are operational. Latency averages 12ms. Prior datasets
                updated as of Oct 2024.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
