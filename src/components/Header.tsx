import React from 'react'
import { alpha, createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import HelpOutline from '@material-ui/icons/HelpOutline'
import InputBase from '@material-ui/core/InputBase'

// General

export default function Header() {
  const classes = useStyles({})

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            &nbsp;<strong>Frictionless Application</strong>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search or query…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Box mr={-2.2}>
            <Button color="inherit">
              <HelpOutline />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  )
}

// Styles

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      flexGrow: 1,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(4),
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    formControl: {
      margin: theme.spacing(1),
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      minWidth: 270,
    },
    select: {
      color: 'white',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
)
