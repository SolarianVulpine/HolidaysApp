import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import './App.css'

const API_URL = 'https://openholidaysapi.org'
const CURRENT_YEAR = new Date().getFullYear()

type LocalizedText = { language: string; text: string }
type Country = { isoCode: string; name: LocalizedText[] }
type Holiday = {
  id: string
  startDate: string
  endDate: string
  type: string
  name: LocalizedText[]
  nationwide: boolean
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
  return response.json() as Promise<T>
}

function localizedText(values: LocalizedText[]) {
  return values.find(({ language }) => language.toLowerCase() === 'en')?.text ?? values[0]?.text ?? 'Unnamed holiday'
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

function App() {
  const [selectedCountry, setSelectedCountry] = useState('NL')
  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: () => fetchJson<Country[]>(`${API_URL}/Countries?languageIsoCode=en`),
  })
  const holidaysQuery = useQuery({
    queryKey: ['holidays', selectedCountry, CURRENT_YEAR],
    queryFn: () => fetchJson<Holiday[]>(`${API_URL}/PublicHolidays?countryIsoCode=${selectedCountry}&validFrom=${CURRENT_YEAR}-01-01&validTo=${CURRENT_YEAR}-12-31&languageIsoCode=en`),
    enabled: Boolean(selectedCountry),
  })

  const countries = [...(countriesQuery.data ?? [])].sort((a, b) => localizedText(a.name).localeCompare(localizedText(b.name)))
  return (
    <main className="sheet padding-15mm page-shell">
      <header className="masthead">
        <h1>Public Holidays</h1>
      </header>
      <section className="control-panel" aria-label="Holiday filters">
        <div>
          <label className="visually-hidden" htmlFor="country">Showing holidays for</label>
          <select id="country" value={selectedCountry} onChange={(event) => setSelectedCountry(event.target.value)} disabled={countriesQuery.isPending || countriesQuery.isError}>
            {countriesQuery.isPending && <option>Loading countries...</option>}
            {countries.map((country) => <option key={country.isoCode} value={country.isoCode}>{localizedText(country.name)}</option>)}
          </select>
        </div>
        <span className="year-label">{CURRENT_YEAR}</span>
      </section>
      <section className="holiday-section" aria-live="polite">
        {countriesQuery.isError && <div className="status-message error-message">Countries could not be loaded. Please refresh and try again.</div>}
        {holidaysQuery.isPending && <div className="status-message">Gathering this year's dates...</div>}
        {holidaysQuery.isError && <div className="status-message error-message">Holiday dates could not be loaded. Please try another country.</div>}
        {holidaysQuery.data?.length === 0 && <div className="status-message">No public holidays found for this year.</div>}
        {holidaysQuery.data && holidaysQuery.data.length > 0 && <div className="holiday-list">{holidaysQuery.data.map((holiday, index) => <article className="holiday-row" key={holiday.id}>
          <span className="holiday-line" aria-hidden="true">-</span>
          <div className="holiday-name"><time dateTime={holiday.startDate}>{formatDate(holiday.startDate)}{holiday.endDate !== holiday.startDate && ` - ${formatDate(holiday.endDate)}`}</time><span className="holiday-separator">-</span><h3>{localizedText(holiday.name)}</h3></div>
          <span className="row-index">{String(index + 1).padStart(2, '0')}</span>
        </article>)}</div>}
      </section>
      <footer>Data from <a href="https://www.openholidaysapi.org/" target="_blank" rel="noreferrer">OpenHolidays API</a></footer>
    </main>
  )
}

export default App
