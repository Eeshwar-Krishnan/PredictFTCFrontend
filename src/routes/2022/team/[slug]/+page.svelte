<TopBar></TopBar>
{#if dataLoaded}
<div class="card-container">
    <Card variant="outlined" padded color='primary'>
        <div class="eventdiv">
            <h3>
                <center>{teamData.teamNum}</center>
            </h3>
            <h5>
                <center>{teamData.teamName}</center>
                <center>Region: {teamData.region}</center>
                <center>
                    <a rel="noopener noreferrer" href="https://ftcscout.org/teams/{teamData.teamNum}" target="_blank">
                        Check this team out on FTC Scout!
                    </a>
                </center>
            </h5>
        </div>
    </Card>
    <center>
        <h6>
            Compare With
        </h6>
    </center>
    <center>
        <FormField align="end">
        <span slot="label">World</span>
        <Switch bind:checked={districtCompare} />
        <span>Region</span>
        </FormField>
    </center>
    <center>
        <LayoutGrid>
            <Cell span={3}>
                <div class="demo-cell">
                    <Card variant="outlined" padded color='primary'>
                        <h4>
                            <center>Non-Penalty OPR: {Math.round(teamData.components[0] * 100)/100}</center>
                        </h4>
                        <center>
                            {#key rankings}
                            <ProgressCircular rotate={180} size={70} width={7} value={(rankings[0] / count) * 100} />
                            {/key}
                            <h6>
                                Rank: {count - rankings[0]}
                            </h6>
                            This team is ranked above {Math.round(((rankings[0] / count) * 100)*100)/100}% of teams
                        </center>
                    </Card>
                </div>
            </Cell>

            <Cell span={3}>
                <div class="demo-cell">
                    <Card variant="outlined" padded color='primary'>
                        <h4>
                            <center>Average Auto Cones: {Math.round(teamData.components[2] * 100)/100}</center>
                        </h4>
                        <center>
                            {#key rankings}
                            <ProgressCircular rotate={180} size={70} width={7} value={(rankings[2] / count) * 100} color="teal" />
                            {/key}
                            <h6>
                                Rank: {count - rankings[2]}
                            </h6>
                            This team scores more auto cones than {Math.round((rankings[2] / count) * 100*100)/100}% of teams 
                        </center>
                    </Card>
                </div>
            </Cell>

            <Cell span={3}>
                <div class="demo-cell">
                    <Card variant="outlined" padded color='primary'>
                        <h4>
                            <center>Average TeleOp Cones: {Math.round(teamData.components[1] * 100)/100}</center>
                        </h4>
                        <center>
                            {#key rankings}
                            <ProgressCircular rotate={180} size={70} width={7} value={(rankings[1] / count) * 100} color="green" />
                            {/key}
                            <h6>
                                Rank: {count - rankings[1]}
                            </h6>
                            This team scores more teleop cones than {Math.round((rankings[1] / count) * 100*100)/100}% of teams
                        </center>
                    </Card>
                </div>
            </Cell>

            <Cell span={3}>
                <div class="demo-cell">
                    <Card variant="outlined" padded color='primary'>
                        <h4>
                            <center>Average Penalty Points: {Math.round(teamData.components[5] * 100)/100}</center>
                        </h4>
                        <center>
                            {#key rankings}
                            <ProgressCircular rotate={180} size={70} width={7} value={100 - (rankings[5] / count) * 100} color="red" />
                            {/key}
                            <h6>
                                Rank: {rankings[5]}
                            </h6>
                            This team commits less penalties than { Math.round((100-((rankings[5] / count) * 100))*100)/100}% of teams
                        </center>
                    </Card>
                </div>
            </Cell>

            <Cell span={3}>
                <div class="demo-cell">
                    <Card variant="outlined" padded color='primary'>
                        <h4>
                            <center>TeleOp Cone Effectiveness: {Math.round(teamData.components[6] * 100)/100}</center>
                        </h4>
                        <center>
                            {#key rankings}
                            <ProgressCircular rotate={180} size={70} width={7} value={(rankings[6] / count) * 100} color="green" />
                            {/key}
                            <h6>
                                Rank: {count - rankings[6]}
                            </h6>
                            This team's TeleOp scoring is more effective then {Math.round((rankings[6] / count) * 100*100)/100}% of teams
                        </center>
                    </Card>
                </div>
            </Cell>

            <Cell span={3}>
                <div class="demo-cell">
                    <Card variant="outlined" padded color='primary'>
                        <h4>
                            <center>Auto Cone Effectiveness: {Math.round(teamData.components[7] * 100)/100}</center>
                        </h4>
                        <center>
                            {#key rankings}
                            <ProgressCircular rotate={180} size={70} width={7} value={(rankings[7] / count) * 100} color="green" />
                            {/key}
                            <h6>
                                Rank: {count - rankings[7]}
                            </h6>
                            This team's auton scoring is more effective then {Math.round((rankings[7] / count) * 100*100)/100}% of teams
                        </center>
                    </Card>
                </div>
            </Cell>
        </LayoutGrid>
    </center>
    <Card variant="outlined" padded color='primary'>
        <AppContent class="app-content">
            <h3>
                <center>Cones</center>
            </h3>
            <main class="main-content">
                <TabBar tabs={clicked} let:tab bind:active={active}>
                    <!-- Note: the `tab` property is required! -->
                    <Tab {tab}>
                    <Label>{tab}</Label>
                    </Tab>
                </TabBar>
                <center>
                    <div class="eventdiv">
                        {#if active != ""}
                            <h7>
                                <a href="https://ftc-events.firstinspires.org/2022/{active}" target="_blank" rel="noopener noreferrer">
                                    Check this event out on FTC Events!
                                </a>
                            </h7>
                        {/if}
                        <Canvas bind:this={canvas} width=300 height=300>
                            <Layer {render} />
                        </Canvas>
                        <h5>
                            Cone Concentration: {Math.round(500 * concentration)/100}
                            {#key concentration}
                            <ProgressCircular rotate={180} size={30} width={7} value={Math.min(concentration * 500, 100)} color="orange" />
                            {/key}
                        </h5>
                    </div>
                </center>
            </main>
        </AppContent>
    </Card>
</div>
{/if}
{#if dataerr}
<h5>
    <center>
        <b>This team either does not exist or has not competed yet!</b>
    </center>
</h5>
{/if}

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
    import { onMount, onDestroy} from 'svelte';
    import Menu from '@smui/menu';
    import IconButton from '@smui/icon-button';
    import Button from '@smui/button';
    import LinearProgress from '@smui/linear-progress';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import TopBar from '../../../TopBar.svelte';
    import Card from '@smui/card';
    import AutoComplete from "@smui-extra/autocomplete";
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Drawer, { AppContent, Content } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';
    import { ProgressCircular, MaterialApp } from 'svelte-materialify';
    import Fuse from 'fuse.js'
    import pRetry, {AbortError} from 'p-retry';
    import { page } from '$app/stores';

    import { Canvas, Layer, t } from "svelte-canvas";

    let img;
    let canvas;

    let imgloaded = false;

    let clicked = [];

    let active = "";

    let districtCompare = false;

    let dataerr = false;

    let teamData = {};

    let dataLoaded = false;

    let rankings = [];
    let count = 0;

    let eventsdata = {};

    let concentration = 0;

    let eventsdataloaded = false;

    export let data;

    loadData();
    loadCones();

    $: {
        adjustRankings(districtCompare);
    }

    onMount(() => {
        img = new Image();
        img.src = '/PPField.png';
        setTimeout(() => {
            imgloaded = true;
        }, 100);
    })

    $: render = ({ context, width, height }) => {
        //console.log($t);
        //context.drawImage(img, 10, 10);
        imgloaded && context.drawImage(img, 0, 0, 300, 300);

    };
    function loadData(){
        fetch('https://api.predictftc.org/v1/2022/insights/team/' + data.slug)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                teamData = data;
                rankings = teamData.globRankings;
                count = teamData.numGlobal;
                if(teamData.teamNum == -1){
                    dataerr = true;
                }else{
                    dataLoaded = true;
                }
            })
            .catch(err => {
                console.error("Load Error", err);
            });
    }

    function loadCones(){
        fetch('https://api.predictftc.org/v1/2022/insights/cones/' + data.slug)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                eventsdata = data;
                data.events.forEach(tmp=>{
                    clicked.push(tmp.eventcode);
                })
                eventsdataloaded = true;
            })
            .catch(err => {
                console.error("Load Error", err);
            });
    }

    function adjustRankings(dtrct){
        if(districtCompare){
            rankings = teamData.districtRankings;
            count = teamData.numDistrict;
        }else{
            rankings = teamData.globRankings;
            count = teamData.numGlobal;
        }
    }

    function getStandardDeviation (array) {
        const n = array.length
        const mean = array.reduce((a, b) => a + b) / n
        return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
    }

    $: render = ({ context, width, height }) => {
        //console.log($t);
        //context.drawImage(img, 10, 10);
        imgloaded && context.drawImage(img, 0, 0, 300, 300);

        eventsdataloaded && eventsdata.events.forEach((event) => {
            if(event.eventcode === active){
                let scale = 0;
                let max = 0;
                let besti = -1;

                let floatCones = [];
                event.cones.forEach((cone, i) => {
                    scale += parseFloat(cone);
                    if(parseFloat(cone) > max){
                        max = parseFloat(cone);
                        besti = i;
                    }
                    floatCones.push(parseFloat(cone));
                });
                scale = scale / 25.0;
                event.cones.forEach((cone, i) => {
                    if(i == besti){
                        context.fillStyle = "black";
                        context.fillRect((Math.trunc(i%5)*50)+41, (Math.trunc(i/5)*50)+41, 19, 19);
                        context.fillStyle = "rgba(" + ((1-Math.min((cone / scale), 1)) * 255) + "," + (Math.min((cone / scale), 1) * 255) + ",0,255)";
                        context.fillRect((Math.trunc(i%5)*50)+43, (Math.trunc(i/5)*50)+43, 15, 15);
                    }else{
                        context.fillStyle = "rgba(" + ((1-(cone / scale)) * 255) + "," + ((cone / scale) * 255) + ",0,255)";
                        context.fillRect((Math.trunc(i%5)*50)+43, (Math.trunc(i/5)*50)+43, 15, 15);
                    }
                });
                
                let tmpConcen = 0;
                let tmpCount = 0;
                let totalCount = 0;
                floatCones.forEach(cone => {
                    if(cone > 0){
                        totalCount += cone;
                    }
                });
                floatCones.forEach(cone => {
                    if(cone > 0){
                        tmpConcen += (cone / totalCount);
                        tmpCount ++;
                    }
                });

                concentration = tmpConcen / tmpCount;
            }
        });

    };
</script>

<style>
    /* These classes are only needed because the
      drawer is in a container on the page. */
    .drawer-container {
      position: relative;
      display: flex;
      height: 350px;
      max-width: 100%;
      border: 1px solid
        var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
      overflow: hidden;
      z-index: 0;
    }
   
    * :global(.app-content) {
      flex: auto;
      overflow: auto;
      position: relative;
      flex-grow: 1;
    }
   
    .main-content {
      overflow: auto;
      padding: 16px;
      height: 100%;
      box-sizing: border-box;
    }

    .demo-cell {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 10px;
        /*background-color: var(--mdc-theme-secondary, #feffff);
        color: var(--mdc-theme-on-secondary, rgb(0, 0, 0));*/
    }

    h1 {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        text-align: center;
    }
  </style>