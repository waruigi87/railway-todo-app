// src/components/HeaderBar.jsx
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLists } from '~/store/list'
import { ListIcon } from '~/icons/ListIcon'
import { PlusIcon } from '~/icons/PlusIcon'
import Button from '~/components/Button'
import { useLogout } from '~/hooks/useLogout'
import './HeaderBar.css'

export const HeaderBar = () => {
  const dispatch = useDispatch()
  const { logout } = useLogout()

  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  const lists = useSelector((state) => state.list.lists)
  const isLoggedIn = useSelector((state) => state.auth.token !== null)
  const userName = useSelector((state) => state.auth.user?.name)

  useEffect(() => {
    if (isLoggedIn) {
      void dispatch(fetchLists())
    }
  }, [dispatch, isLoggedIn])

  return (
    <>
      {/* 上部のヘッダー */}
      <header className="header_bar">
        <h1 className="header_bar__title">Todos</h1>
        {isLoggedIn && (
          <button
            type="button"
            className="header_bar__hamburger"
            aria-label="Open menu"
            onClick={toggleMenu}
          >
            ☰
          </button>
        )}
      </header>

      {/* 上からスライドインするメニュー */}
      <div
        className={`header_menu ${isOpen ? 'header_menu--open' : ''}`}
        aria-hidden={!isOpen}
      >
        {isLoggedIn ? (
          <div className="header_menu__inner">
            <p className="header_menu__user">{userName}</p>

            <div className="header_menu__section">
              <p className="header_menu__section_title">Lists</p>
              <ul className="header_menu__list">
                {lists?.map((list) => (
                  <li key={list.id}>
                    <Link
                      to={`/lists/${list.id}`}
                      className="header_menu__item"
                      onClick={closeMenu}
                    >
                      <ListIcon
                        aria-hidden
                        className="header_menu__item_icon"
                      />
                      {list.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/list/new"
                    className="header_menu__new_list"
                    onClick={closeMenu}
                  >
                    <PlusIcon className="header_menu__item_icon" />
                    New List...
                  </Link>
                </li>
              </ul>
            </div>

            <Button
              type="button"
              className="header_menu__logout"
              onClick={() => {
                logout()
                closeMenu()
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="header_menu__inner">
            <Link to="/signin" onClick={closeMenu}>
              Login
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
