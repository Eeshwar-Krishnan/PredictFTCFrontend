<TopAppBar
variant="static"
{prominent}
{dense}
color={secondaryColor ? 'secondary' : 'primary'}
class="topbar"
>
<Row>
  <Section>
    <IconButton class="material-icons">
        <Menu />
    </IconButton>
    <Title>FTC Analytics</Title>
  </Section>
  <Section align="end" toolbar>
    <h2>
        Alpha
    </h2>
  </Section>
</Row>
</TopAppBar>

<script>
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    // @ts-ignore
    import IconButton, { Icon }  from '@smui/icon-button';
    import Menu from "svelte-material-icons/Menu.svelte";
    let prominent = false;
    let dense = false;
    let secondaryColor = false;
</script>