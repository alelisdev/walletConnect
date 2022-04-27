import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid #6c757d',
    padding: 40,
  },
  closeButton: {
    position: 'absolute',
    right: '10px',
    color: theme.palette.grey[500],
  },
  topTitle: {
      position: 'absolute',
      left: '20px',
  }
})

function DialogTitle(props) {
  const { children, classes, onClose, TypographyProps } = props

  return (
    <div className={classes.root}>
      <Typography className = {classes.topTitle} {...TypographyProps}>
        <b style = {{fontSize: '1.25em'}}>{children}</b>
      </Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </div>
  )
}

DialogTitle.displayName = 'DialogTitle'

DialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  TypographyProps: PropTypes.object,
}

export default withStyles(styles)(DialogTitle)