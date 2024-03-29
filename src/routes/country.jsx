import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getCountries, numberFormat } from '../utils'

export function Country() {
  const [country, setCountry] = useState({})
  const [borderCountries, setBorderCountries] = useState([])
  const { countryId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getCountries(`alpha/${countryId}`).then(setCountry)
  }, [])

  useEffect(() => {
    const codeList = country.borders?.join(',')
    if (codeList) {
      const endpoint = `alpha?codes=${codeList}&fields=name,alpha3Code`
      getCountries(endpoint).then(setBorderCountries)
    }
  }, [country])

  return (
    <div className="country">
      <div>
        <button className="country__btn" onClick={() => navigate(-1)}>
          <span>&#8592;</span>
          back
        </button>
        <img
          className="country__img"
          src={country.flags?.svg}
          alt={`Flag of ${country.name}`}
        />
      </div>

      <div>
        <h1 className="country__title">{country.name}</h1>
        <ul className="country__details">
          <li>
            <span>Native Name:</span> {country.nativeName}
          </li>
          <li>
            <span>Population:</span> {numberFormat(country.population)}
          </li>
          <li>
            <span>Region:</span> {country.region}
          </li>
          <li>
            <span>Sub Region:</span> {country.subregion}
          </li>
          <li>
            <span>Capital:</span> {country.capital}
          </li>
          <li>
            <span>Top Level Domain:</span> {country.topLevelDomain?.join(', ')}
          </li>
          <li>
            <span>Currencies:</span>{' '}
            {country.currencies?.map((c) => c.name).join(', ')}
          </li>
          <li>
            <span>Languages:</span>{' '}
            {country.languages?.map((l) => l.name).join(', ')}
          </li>
        </ul>

        {borderCountries.length > 0 && (
          <>
            <li className="country__borders-title">
              <strong>Border countries:</strong>
            </li>
            <ul className="country__borders-items">
              {borderCountries.map((borderCountry) => (
                <li key={borderCountry.name}>
                  <button
                    onClick={() =>
                      window.location.assign(`/${borderCountry.alpha3Code}`)
                    }
                  >
                    {borderCountry.name}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
