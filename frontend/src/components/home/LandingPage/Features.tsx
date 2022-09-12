import Image from 'next/image';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Container, Grid, Typography, Box } from '@material-ui/core';

import { LinkButton, ScrolledTypography } from 'templates';
import filingSystem from 'images/filing_system.svg';
import drag from 'images/drag.svg';
import search from 'images/search.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background:
        'repeating-linear-gradient(240deg, #e0fffa87, transparent 250px)',
    },
    container: {
      marginTop: theme.spacing(12),
      marginBottom: theme.spacing(12),
      [theme.breakpoints.up('sm')]: {
        minHeight: '90vh',
      },
    },
    features: {
      '& > .feature': { padding: theme.spacing(4) },
    },
  })
);

/** パスを含むファイル名からパス及び拡張子を取り除く */
const basename = (filename: string) => {
  const startIndex =
    filename.lastIndexOf('/') !== -1 ? filename.lastIndexOf('/') + 1 : 0;
  const endIndex =
    filename.indexOf('.') !== -1 ? filename.indexOf('.') : filename.length;

  return filename.slice(startIndex, endIndex);
};

const FeatureLayout: React.FC<{ image: string; header: string }> = (props) => {
  const { children, image, header } = props;

  return (
    <Grid item md={4} sm={9} xs={11} className="feature">
      <Grid container direction="column" alignItems="center">
        <Box position="relative" width="100%" height="300px">
          <Image src={image} alt={basename(image)} layout="fill" />
        </Box>
        <Box width="100%" mt={2}>
          <ScrolledTypography variant="h3" align="center" gutterBottom>
            {header}
          </ScrolledTypography>
        </Box>
        <Typography paragraph>{children}</Typography>
      </Grid>
    </Grid>
  );
};

const Features = () => {
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <Typography variant="h2" title="Features" hidden>
          {'Features'}
        </Typography>
        <Grid
          container
          justifyContent="space-around"
          className={classes.features}
        >
          <FeatureLayout image={filingSystem.src} header="サブタスク管理">
            各タスクはカードと呼ばれる単位で扱われ、リストの下に配置されます。
            リストは複数のカードを持ち、またボード上で複数のリストを管理することができます。
          </FeatureLayout>
          <FeatureLayout image={drag.src} header="ドラッグ&amp;ドロップ">
            カードはドラッグによりその配置を自由に入れ替えることが可能です。
            期限や重要度の変化に応じて常にボードの状態を更新することができます。
          </FeatureLayout>
          <FeatureLayout image={search.src} header="タスク検索">
            キーワードによってタスクを検索することが可能です。
            多くの情報の中から目的のタスクを探し出す手間を省きます。
          </FeatureLayout>
        </Grid>
        <Box mt={12} mb={8} mx="auto" width={300}>
          <LinkButton to="/register" size="large" fullWidth>
            始める
          </LinkButton>
        </Box>
      </Container>
    </section>
  );
};

export default Features;
