import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/styles/createStyles';
import makeStyles from '@material-ui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import Particles from 'react-particles-js';
import { colors } from 'src/constants';

const MyParticles: React.FC = () => {
  const classes = useStyles();

  const [teste, setTeste] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setTeste(false)
    }, 1000);
  }, []);

  return (
    <a href={"https://ab2.gallery/asset/435041110"} target='_blank'>
      <Particles
        className={classes.particles}
        params={{
          particles: {
            number: {
              value: 20,
              density: {
                enable: true,
                value_area: 1000
              }
            },
            // line_linked: {
            //   enable: false
            // },
            links: {
              enable: false
            },
            move: {
              speed: 2,
              out_mode: 'bounce'
            },
            shape: {
              type: ['image'],
              image: [
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267708345319424/blanks_91.png?width=150&height=150',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267391562154004/blanks_9.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267431655477348/blanks_25.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267531979038730/blanks_66.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267603710038016/blanks_59.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267647284658176/blanks_56.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267693879169134/blanks_98.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
                {
                  src: 'https://media.discordapp.net/attachments/912161232625225769/913267813907591258/blanks_13.png?width=650&height=650',
                  height: 100,
                  width: 100
                },
              ]
            },
            opacity: {
              value: 1,
              random: false,
              anim: {
                enable: false,
              }
            },
            size: {
              value: 50,
              random: false,
              anim: {
                enable: false,
              }
            }
          },
          retina_detect: teste
        }}
      />
    </a>
  );
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    particles: {
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: colors.backgroundDark,
      zIndex: 0
    }
  })
);

export default MyParticles;
