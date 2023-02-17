<TopBar></TopBar>
<div class="card-container">
    <Card variant="outlined" padded color='primary'>
        <div class="teamdiv">
            <h3>
                Team:
            </h3>
            <Textfield variant="outlined" bind:value={teamvalue} label="Team Number or Name">
            </Textfield>
        </div>
    </Card>
    <Card variant="outlined" padded color='primary'>
        <DataTable sortable stickyHeader="true" table$aria-label="User list" style="width: 100%;">
            <Head>
              <Row>
                <Cell>Number</Cell>
                <Cell numeric>OPR</Cell>
                <Cell numeric>TeleOp Cones</Cell>
                <Cell numeric>Auto Cones</Cell>
              </Row>
            </Head>
            <Body>
              {#each toDisplaySplice as item, i (item.teamNum)}
                <Row>
                    <Cell>
                        <a href="https://predictftc.org/2022/team/{item.teamNum}">
                            {item.teamNum}: {item.teamName}
                        </a>
                    </Cell>
                    <Cell numeric>{item.components[0]}</Cell>
                    <Cell numeric>{item.components[1]}</Cell>
                    <Cell numeric>{item.components[2]}</Cell>
                </Row>
              {/each}
            </Body>
           
            <LinearProgress
              indeterminate
              bind:closed={loaded}
              aria-label="Data is being loaded..."
              slot="progress"
            />
            <Pagination slot="paginate">
                <svelte:fragment slot="rowsPerPage">
                  <Label>Rows Per Page</Label>
                  <Select variant="outlined" bind:value={rowsPerPage} noLabel>
                    <Option value={10}>10</Option>
                    <Option value={25}>25</Option>
                    <Option value={100}>100</Option>
                  </Select>
                </svelte:fragment>
                <svelte:fragment slot="total">
                  {start + 1}-{end} of {toDisplay.length}
                </svelte:fragment>
             
                <IconButton
                  class="material-icons"
                  action="first-page"
                  title="First page"
                  on:click={() => (currentPage = 0)}
                  disabled={currentPage === 0}>first_page</IconButton
                >
                <IconButton
                  class="material-icons"
                  action="prev-page"
                  title="Prev page"
                  on:click={() => currentPage--}
                  disabled={currentPage === 0}>chevron_left</IconButton
                >
                <IconButton
                  class="material-icons"
                  action="next-page"
                  title="Next page"
                  on:click={() => currentPage++}
                  disabled={currentPage === lastPage}>chevron_right</IconButton
                >
                <IconButton
                  class="material-icons"
                  action="last-page"
                  title="Last page"
                  on:click={() => (currentPage = lastPage)}
                  disabled={currentPage === lastPage}>last_page</IconButton
                >
              </Pagination>
          </DataTable>
    </Card>
    <Dialog
        bind:open={loadError}
        aria-labelledby="simple-title"
        aria-describedby="simple-content"
        scrimClickAction=""
        escapeKeyAction=""
        >
        <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
        <Title id="simple-title">Load Error</Title>
        <Content id="simple-content">The requested data could not be retrieved, most likely the event could not be processed. If the event has divisions, you need to enter the event division instead of just the event name</Content>
        <Actions>
            <Button on:click={() => (loadError = false)}>
            <Label>Close</Label>
            </Button>
        </Actions>
        </Dialog>
</div>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
/>
<!-- Roboto -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
/>
<!-- Roboto Mono -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css?family=Roboto+Mono"
/>

<script>
// @ts-nocheck
    import Menu from '@smui/menu';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import IconButton from '@smui/icon-button';
    import Button, { Label } from '@smui/button';
    import List, { Item, Separator, Text } from '@smui/list';
    import LinearProgress from '@smui/linear-progress';
    import DataTable, {
        Head,
        Body,
        Row,
        Cell,
        Pagination,
    } from '@smui/data-table';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';
    import TopBar from './TopBar.svelte';
    import Card from '@smui/card';
    import AutoComplete from "@smui-extra/autocomplete";
    import HelperText from '@smui/textfield/helper-text';
    import Fuse from 'fuse.js'

    import * as eventsJSON from './events.json';
    import * as teamsJSON from './teams.json';

    const eventsarr = eventsJSON["default"];

    let sort = 'id';
    let sortDirection = 'ascending';

    let loadError = false;

    let teamsEnabled = true;

    let loaded = true;

    let predictions = [];

    let toDisplay = [];

    let toDisplaySplice = [];

    const fuse = new Fuse(eventsarr, {
        keys: ["name", "code"]
    })

    let teamsarr = [];

    const colors = ["White", "Red", "Yellow", "Green", "Blue", "Black"];

    let eventval;
    let teamvalue = '';

    let teamSearch;

    let rowsPerPage = 10;
    let currentPage = 0;
    
    $: start = currentPage * rowsPerPage;
    $: end = Math.min(start + rowsPerPage, toDisplay.length);
    $: toDisplaySplice = toDisplay.slice(start, end);
    $: lastPage = Math.max(Math.ceil(toDisplay.length / rowsPerPage) - 1, 0);
    
    $: if (currentPage > lastPage) {
        currentPage = lastPage;
    }

    loadThings();

    $: {
        if(loaded){
            if(teamvalue === ""){
                toDisplay = predictions;
            }else{
                searchTeams(teamvalue);
            }
        }
    }

    async function searchEvents(input) {
        let results = fuse.search(input);
        return results.slice(0, 10);
    }

    async function searchTeams(input){
        toDisplay = [];
        predictions.forEach(item => {
            let inputLower = input.toLowerCase();
            if((item.teamNum.toLowerCase().includes(inputLower.toLowerCase()) || item.teamName.toLowerCase().includes(inputLower.toLowerCase()))){
                toDisplay.push(item);
            }
        });
        toDisplay = toDisplay.slice(0, 20);
    }

    function loadThings(){
        loaded = false;
        const requestOptions = {
            method: "GET",
            mode: "no-cors",
        } 
        try{
            fetch("https://api.predictftc.org/v1/2022/insights/teams")
                .then((response) => {
                    if(!response.ok){
                        loaded = true;
                        //loadError = true;
                        throw Error(response.statusText);
                    }
                    return response.json();
                })
                .then((json) =>
                setTimeout(
                    () => {
                    predictions = json.teams;
                    teamSearch = new Fuse(predictions, {
                        keys: ["teamNum", "teamName"]
                    })
                    handleSort();
                    toDisplay = predictions;
                    //console.log(predictions);
                    loaded = true;
                    },
                    500
                )
                ).catch(function (){
                    console.log("Test");
                    loaded = true;
                    //loadError = true;
                });
        } catch(e){
            loaded = true;
        }
    }

    function getName(number){
        let name = "Unknown Name";
        Object.entries(teamsJSON).forEach(([key, value]) => {
            if(Array.isArray(value)){
                value.forEach(ele2 => {
                    if(ele2["num"] == number){
                        name = ele2["name"];
                    }
                });
            }
        });
        return name;
    }

    function handleSort() {
        predictions = predictions.sort((a, b) => {
            return b.components[0] - a.components[0];
        });
    }
</script>

<style>
.buttondiv :global(button){
    width: 100%
}

.buttondiv{
    margin-top:10px;
    width:100%;
}

.eventdiv :global(.eventsearchbox){
    display: inline-block;
    margin-right: 10px;
    width: 100%;
}

h3{
    margin-top: 13.5px; margin-bottom: 0px; margin-right: 30px; margin-left: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.teamdiv :global(.teamsearchbox){
    display: inline-block;
    margin-left:3px;
    margin-right:10px;
    width: 100%;
}

.eventdiv {
    display: flex;
    justify-content: center;
    width: 100%
}

.teamdiv {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 5px;
}

.card-container{
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    justify-content: center;
    height: 50%;
}

:root {
  --mdc-theme-primary: #aa00ff;
  --mdc-theme-secondary: #676778;
  --mdc-theme-background: #fff;
  --mdc-theme-surface: #fff;
  --mdc-theme-error: #b71c1c;
  --mdc-theme-on-primary: #fff;
  --mdc-theme-on-secondary: #fff;
  --mdc-theme-on-surface: #000;
  --mdc-theme-on-error: #fff;
  --mdc-theme-text-primary-on-background: rgba(0, 0, 0, 0.87);
  --mdc-theme-text-secondary-on-background: rgba(0, 0, 0, 0.54);
  --mdc-theme-text-hint-on-background: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-disabled-on-background: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-icon-on-background: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-primary-on-light: rgba(0, 0, 0, 0.87);
  --mdc-theme-text-secondary-on-light: rgba(0, 0, 0, 0.54);
  --mdc-theme-text-hint-on-light: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-disabled-on-light: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-icon-on-light: rgba(0, 0, 0, 0.38);
  --mdc-theme-text-primary-on-dark: white;
  --mdc-theme-text-secondary-on-dark: rgba(255, 255, 255, 0.7);
  --mdc-theme-text-hint-on-dark: rgba(255, 255, 255, 0.5);
  --mdc-theme-text-disabled-on-dark: rgba(255, 255, 255, 0.5);
  --mdc-theme-text-icon-on-dark: rgba(255, 255, 255, 0.5);
}

/* Layout grid spacing. */
:root {
  --mdc-layout-grid-margin-desktop: 24px;
  --mdc-layout-grid-gutter-desktop: 24px;
  --mdc-layout-grid-column-width-desktop: 72px;
  --mdc-layout-grid-margin-tablet: 16px;
  --mdc-layout-grid-gutter-tablet: 16px;
  --mdc-layout-grid-column-width-tablet: 72px;
  --mdc-layout-grid-margin-phone: 16px;
  --mdc-layout-grid-gutter-phone: 16px;
  --mdc-layout-grid-column-width-phone: 72px;
  margin-top: 0px;
}
</style>