<TopBar></TopBar>
<div class="card-container">
    <Card variant="outlined" padded color='primary'>
        <div class="eventdiv">
            <h3>
                Team:
            </h3>
            <Textfield
                class="shaped-outlined"
                variant="outlined"
                bind:value={teamsval}
                label="Team Search"
                >
                <HelperText slot="helper">Enter Team Number or Name</HelperText>
            </Textfield>
        </div>
    </Card>
    <Card varient="outlined" padded>
        <LinearProgress indeterminate bind:closed={progressclosed}/>
        <div class="drawer-container" style="height: 75%">
            <Drawer variant="modal" bind:open={drawerOpen}>
                <Content>
                    <List href="javascript:void(0)">
                        {#each tmpteams as item, i (item.teamNum)}
                            <Item on:click={() => setActive(item)}>
                                {item.teamNum}: {truncate(item.teamName, 25)}
                            </Item>
                        {/each}
                    </List>
                </Content>
            </Drawer>
            <AppContent class="app-content">
                <main class="main-content">
                    <TabBar tabs={clicked.events} let:tab bind:active={activetab}>
                        <!-- Note: the `tab` property is required! -->
                        <Tab {tab}>
                          <Label>{tab}</Label>
                        </Tab>
                    </TabBar>
                    <div>
                        <Canvas bind:this={canvas}>
                            <Layer {render} />
                          </Canvas>
                    </div>
                </main>
            </AppContent>
        </div>
    </Card>
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
    import { onMount, onDestroy} from 'svelte';
    import Menu from '@smui/menu';
    import IconButton from '@smui/icon-button';
    import Button from '@smui/button';
    import LinearProgress from '@smui/linear-progress';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import TopBar from '../../TopBar.svelte';
    import Card from '@smui/card';
    import AutoComplete from "@smui-extra/autocomplete";
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Drawer, { AppContent, Content } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';
    import Fuse from 'fuse.js'
    import Heatmap from "./heatmap.svelte";
    import pRetry, {AbortError} from 'p-retry';

    let teamsval = "";

    let teams = [];
    let tmpteams = [];
    let events = [];
    let loaded = false;

    let activetab;

    let clicked = {};

    let progressclosed = false;
    let progress2closed = false;

    let fuse;
    
    updateTeamList("");

    $: {
        let tmptab = teamsval;
        if(progressclosed && !(tmptab == null)){
            drawerOpen = true;
            if(tmptab == ""){
                drawerOpen = false;
            }

            updateTeamList(tmptab);
        }
    }

    let eventsdata = {};
    let eventsdataloaded = false;

    const fetchTeam = async () => {
        console.log(clicked);
        const response = await fetch('https://api.predictftc.org/v1/2022/insights/team/' + clicked.teamNum);

        // Abort retrying if the resource doesn't exist
        if (response.status === 404) {
            throw new AbortError(response.statusText);
        }

        return response;
    }

    $: {
        let teamnum = clicked.teamNum;
        if(teamnum != null){
            eventsdataloaded = false;
            progress2closed = false;
            pRetry(fetchTeam, { retries: 5, minTimeout: 2000})
                    .then((response) => {
                        if(!response.ok){
                            throw Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then((json) =>
                    setTimeout(
                        () => {
                        //teams = json.teams;
                            eventsdata = json;
                            eventsdataloaded = true;
                            progress2closed = true;
                        },
                        500
                    )
                    ).catch(function (){
                    });
            }
    }

    async function searchTeams(input) {
        //let results = fuse.search(input);
        //return results.slice(0, 10);
        console.log("Test");
    }

    function truncate( str, n ){
        if (str.length > n) {
            str = str.substring(0, n-1) + "...";
        }
        return str;
    };

    function updateTeamList(str){
        if(str === ""){
            str = "10";
        }
        if(str.length < 2){
            str = str + "0";
        }
        const fetchTeams = async () => {
            const response = await fetch('http://localhost:7244/v1/2022/insights/teams?partial=' + str);//https://api.predictftc.org/v1/2022/insights/teams?partial=

            // Abort retrying if the resource doesn't exist
            if (response.status === 404) {
                throw new AbortError(response.statusText);
            }

            return response;
        }
        pRetry(fetchTeams, { retries: 0, minTimeout: 2000})
            .then((response) => {
                if(!response.ok){
                    //progressclosed = true;
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((json) =>
            setTimeout(
                () => {
                teams = json.teams;
                fuse = new Fuse(teams, {
                    keys: ["teamNum", "teamName"]
                });
                progressclosed = true;
                let tmp = fuse.search(str).slice(0, 20);
                tmpteams = [];
                if(str === ""){
                    tmpteams = teams.slice(0, 50);;
                }else{
                    tmp.forEach((item) => {
                        tmpteams.push(item.item);
                    });
                    tmpteams.slice(0, 50);
                }
                console.log(tmpteams.length);
                },
                500
            )
            ).catch(function (){
                //progressclosed = true;
            });
    }

    import { Canvas, Layer, t } from "svelte-canvas";

    let img;
    let canvas;

    let imgloaded = false;

    onMount(() => {
        img = new Image();
        img.src = '../PPField.png';
        setTimeout(() => {
            imgloaded = true;
        }, 100);
    })

    $: render = ({ context, width, height }) => {
        //console.log($t);
        //context.drawImage(img, 10, 10);
        imgloaded && context.drawImage(img, 0, 0, 300, 300);

        eventsdataloaded && eventsdata.events.forEach((event) => {
            if(event.eventcode === activetab){
                let scale = 0;
                let max = 0;
                let besti = -1;
                event.cones.forEach((cone, i) => {
                    scale += parseFloat(cone);
                    if(parseFloat(cone) > max){
                        max = parseFloat(cone);
                        besti = i;
                    }
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
            }
        });

    };
    let drawerOpen = false;
    function setActive(item){
        clicked = item;
        drawerOpen = false;
    }
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
  </style>