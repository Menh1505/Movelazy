import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from '../../assets/icons/ArrowLeft/ArrowLeft'

export const SolNavbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border bg-background-light">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-text hover:text-text-muted"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <ul className="flex gap-4">
        <li>
          <Link to="/sol/compiler" className="text-white hover:text-white/80">
            Compile
          </Link>
        </li>
        <li>
          <Link to="/sol/tester" className="text-white hover:text-white/80">
            Test
          </Link>
        </li>
        <li>
          <Link to="/sol/deployer" className="text-white hover:text-white/80">
            Deploy
          </Link>
        </li>
      </ul>
    </nav>
  )
}