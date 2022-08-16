import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CountryItem } from '../components/CountryItem'
import { Option, Select } from '../components/Select'
import { getCountries } from '../utils'

function setRegionStorage(region) {
  window.localStorage.setItem('region', region ?? '')
  return region
}

export function Countries() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState(
    window.localStorage.getItem('region') ?? ''
  )

  const regions = useRef([
    { value: 'africa', label: 'Africa' },
    { value: 'americas', label: 'Americas' },
    { value: 'asia', label: 'Asia' },
    { value: 'europe', label: 'Europe' },
    { value: 'oceania', label: 'Oceania' },
  ])

  useEffect(() => {
    if (!search && !region) {
      getCountries().then(setCountries)
    }

    let timeoutId = null
    if (search) {
      timeoutId = setTimeout(() => {
        getCountries(`name/${search}`).then(setCountries)
      }, 300)
    }

    if (region) {
      getCountries(`region/${region}`).then(setCountries)
    }

    return () => clearTimeout(timeoutId)
  }, [search, region])

  const handleSearch = function (e) {
    setSearch(e.target.value)
  }

  const handleSelect = function (value) {
    setRegion(setRegionStorage(value))
  }

  return (
    <div className="countries">
      <div className="countries__filters">
        <div className="search">
          <span className="search__icon">
            <ion-icon name="search"></ion-icon>
          </span>
          <input
            type="text"
            id="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search for a country..."
          />
        </div>
        <Select value={region} onChange={handleSelect}>
          <Option value="">Filter by region</Option>
          {regions.current.map((region) => (
            <Option key={region.value} value={region.value}>
              {region.label}
            </Option>
          ))}
        </Select>
      </div>
      <ul className="country-items">
        {countries.map((country) => (
          <li key={country.alpha3Code}>
            <Link to={`/${country.alpha3Code}`}>
              <CountryItem country={country} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
