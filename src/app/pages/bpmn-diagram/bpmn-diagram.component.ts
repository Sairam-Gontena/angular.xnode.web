import {
  AfterContentInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  OnInit,
  Renderer2
} from '@angular/core';


import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';

// import magicPropertiesProviderModule from './provider/magic';
// import magicModdleDescriptor from './descriptors/magic';
// import * as camundaCloudBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';


// import camundaCloudBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';
import * as camundaModdleDescriptors from 'camunda-bpmn-moddle/resources/camunda.json';
import * as palette_tools_class from './custom-palette-provider.json';
import * as custom from './custom.json';
import Modeler from 'bpmn-js/lib/Modeler';
import PropertiesPanel from 'bpmn-js/lib/Modeler';
import { from, Observable } from 'rxjs';


@Component({
  selector: 'xnode-bpmn-diagram',
  templateUrl: './bpmn-diagram.component.html',
  styleUrls: ['./bpmn-diagram.component.scss']
})
export class BpmnDiagramComponent implements OnInit, AfterContentInit {
  bpmnJS: any;
  pallete_classes: any;
  selected_classes: any;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
//   private xml: string = `<?xml version="1.0" encoding="UTF-8"?>
// <bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" xmlns:magic="http://magic" id="sample-diagram"><bpmn:process id="Process_1" isExecutable="false"><bpmn:startEvent id="StartEvent_1" magic:spell="WOOO ZAAAA" name="start"><bpmn:outgoing>Flow_0b86tmt</bpmn:outgoing></bpmn:startEvent><bpmn:task id="Activity_07ufsuu" name="username and password"><bpmn:incoming>Flow_0b86tmt</bpmn:incoming><bpmn:outgoing>Flow_0i4jkby</bpmn:outgoing></bpmn:task><bpmn:sequenceFlow id="Flow_0b86tmt" sourceRef="StartEvent_1" targetRef="Activity_07ufsuu" /><bpmn:intermediateThrowEvent id="Event_1sy2mr0" name="catch"><bpmn:incoming>Flow_0i4jkby</bpmn:incoming><bpmn:outgoing>Flow_00roh8w</bpmn:outgoing></bpmn:intermediateThrowEvent><bpmn:sequenceFlow id="Flow_0i4jkby" sourceRef="Activity_07ufsuu" targetRef="Event_1sy2mr0" /><bpmn:task id="Activity_161zqfu" name="check username and password"><bpmn:incoming>Flow_00roh8w</bpmn:incoming><bpmn:outgoing>Flow_1er8x2v</bpmn:outgoing><bpmn:property id="Property_1gl30q2" name="__targetRef_placeholder" /><bpmn:dataInputAssociation id="DataInputAssociation_11cdydz"><bpmn:sourceRef>DataStoreReference_1awwsm1</bpmn:sourceRef><bpmn:targetRef>Property_1gl30q2</bpmn:targetRef></bpmn:dataInputAssociation></bpmn:task><bpmn:sequenceFlow id="Flow_00roh8w" sourceRef="Event_1sy2mr0" targetRef="Activity_161zqfu" /><bpmn:dataStoreReference id="DataStoreReference_1awwsm1" name="datastore" /><bpmn:exclusiveGateway id="Gateway_02dy648"><bpmn:incoming>Flow_1er8x2v</bpmn:incoming><bpmn:outgoing>Flow_1x7vztt</bpmn:outgoing><bpmn:outgoing>Flow_06jgz32</bpmn:outgoing></bpmn:exclusiveGateway><bpmn:sequenceFlow id="Flow_1er8x2v" sourceRef="Activity_161zqfu" targetRef="Gateway_02dy648" /><bpmn:task id="Activity_0vi41qb" name="complete login process"><bpmn:incoming>Flow_1x7vztt</bpmn:incoming><bpmn:outgoing>Flow_1yz5fst</bpmn:outgoing></bpmn:task><bpmn:sequenceFlow id="Flow_1x7vztt" name="true" sourceRef="Gateway_02dy648" targetRef="Activity_0vi41qb" /><bpmn:task id="Activity_0owm4at" name="start login process again"><bpmn:incoming>Flow_06jgz32</bpmn:incoming></bpmn:task><bpmn:sequenceFlow id="Flow_06jgz32" name="false" sourceRef="Gateway_02dy648" targetRef="Activity_0owm4at" /><bpmn:endEvent id="Event_0n7rxfk" name="login succeed"><bpmn:incoming>Flow_1yz5fst</bpmn:incoming></bpmn:endEvent><bpmn:sequenceFlow id="Flow_1yz5fst" sourceRef="Activity_0vi41qb" targetRef="Event_0n7rxfk" /></bpmn:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"><bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1"><dc:Bounds x="173" y="102" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="180" y="145" width="23" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_07ufsuu_di" bpmnElement="Activity_07ufsuu"><dc:Bounds x="260" y="80" width="100" height="80" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Event_1sy2mr0_di" bpmnElement="Event_1sy2mr0"><dc:Bounds x="292" y="292" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="297" y="335" width="27" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_161zqfu_di" bpmnElement="Activity_161zqfu"><dc:Bounds x="380" y="270" width="100" height="80" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="DataStoreReference_1awwsm1_di" bpmnElement="DataStoreReference_1awwsm1"><dc:Bounds x="405" y="395" width="50" height="50" /><bpmndi:BPMNLabel><dc:Bounds x="407" y="452" width="46" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNShape id="Gateway_02dy648_di" bpmnElement="Gateway_02dy648" isMarkerVisible="true"><dc:Bounds x="535" y="285" width="50" height="50" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0vi41qb_di" bpmnElement="Activity_0vi41qb"><dc:Bounds x="690" y="190" width="100" height="80" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0owm4at_di" bpmnElement="Activity_0owm4at"><dc:Bounds x="690" y="380" width="100" height="80" /><bpmndi:BPMNLabel /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Event_0n7rxfk_di" bpmnElement="Event_0n7rxfk"><dc:Bounds x="902" y="52" width="36" height="36" /><bpmndi:BPMNLabel><dc:Bounds x="886" y="95" width="68" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNShape><bpmndi:BPMNEdge id="Flow_0b86tmt_di" bpmnElement="Flow_0b86tmt"><di:waypoint x="209" y="120" /><di:waypoint x="260" y="120" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_0i4jkby_di" bpmnElement="Flow_0i4jkby"><di:waypoint x="310" y="160" /><di:waypoint x="310" y="292" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_00roh8w_di" bpmnElement="Flow_00roh8w"><di:waypoint x="328" y="310" /><di:waypoint x="380" y="310" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="DataInputAssociation_11cdydz_di" bpmnElement="DataInputAssociation_11cdydz"><di:waypoint x="430" y="395" /><di:waypoint x="430" y="350" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1er8x2v_di" bpmnElement="Flow_1er8x2v"><di:waypoint x="480" y="310" /><di:waypoint x="535" y="310" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1x7vztt_di" bpmnElement="Flow_1x7vztt"><di:waypoint x="560" y="285" /><di:waypoint x="560" y="230" /><di:waypoint x="690" y="230" /><bpmndi:BPMNLabel><dc:Bounds x="566" y="255" width="18" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_06jgz32_di" bpmnElement="Flow_06jgz32"><di:waypoint x="560" y="335" /><di:waypoint x="560" y="420" /><di:waypoint x="690" y="420" /><bpmndi:BPMNLabel><dc:Bounds x="564" y="375" width="23" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1yz5fst_di" bpmnElement="Flow_1yz5fst"><di:waypoint x="790" y="230" /><di:waypoint x="846" y="230" /><di:waypoint x="846" y="70" /><di:waypoint x="902" y="70" /></bpmndi:BPMNEdge></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn:definitions>`;

private xml: string = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="12.0.0">
  <collaboration id="Collaboration_0c2fddn">
    <participant id="Participant_1tq7aqn" processRef="Process_1" />
  </collaboration>
  <process id="Process_1" isExecutable="false">
    <laneSet id="LaneSet_0idnr49" />
    <startEvent id="StartEvent_1y45yut" name="hunger noticed">
      <outgoing>SequenceFlow_0h21x7r</outgoing>
    </startEvent>
    <exclusiveGateway id="ExclusiveGateway_15hu1pt" name="desired dish?">
      <incoming>SequenceFlow_0wnb4ke</incoming>
    </exclusiveGateway>
    <subProcess id="Task_1hcentk" name="choose recipe">
      <incoming>SequenceFlow_0h21x7r</incoming>
      <outgoing>SequenceFlow_0wnb4ke</outgoing>
      <task id="Activity_06lj5c2">
        <outgoing>Flow_1lvnlkn</outgoing>
        <outgoing>Flow_1lgtead</outgoing>
      </task>
      <endEvent id="Event_1dqefh8">
        <incoming>Flow_1lvnlkn</incoming>
      </endEvent>
      <exclusiveGateway id="Gateway_13deigc">
        <incoming>Flow_1lgtead</incoming>
        <outgoing>Flow_0t5frj2</outgoing>
      </exclusiveGateway>
      <task id="Activity_0w97r1l">
        <incoming>Flow_0t5frj2</incoming>
        <outgoing>Flow_1hbfacp</outgoing>
      </task>
      <endEvent id="Event_07acibb">
        <incoming>Flow_1hbfacp</incoming>
      </endEvent>
      <sequenceFlow id="Flow_1lvnlkn" sourceRef="Activity_06lj5c2" targetRef="Event_1dqefh8" />
      <sequenceFlow id="Flow_1lgtead" sourceRef="Activity_06lj5c2" targetRef="Gateway_13deigc" />
      <sequenceFlow id="Flow_0t5frj2" sourceRef="Gateway_13deigc" targetRef="Activity_0w97r1l" />
      <sequenceFlow id="Flow_1hbfacp" sourceRef="Activity_0w97r1l" targetRef="Event_07acibb" />
    </subProcess>
    <sequenceFlow id="SequenceFlow_0h21x7r" sourceRef="StartEvent_1y45yut" targetRef="Task_1hcentk" />
    <sequenceFlow id="SequenceFlow_0wnb4ke" sourceRef="Task_1hcentk" targetRef="ExclusiveGateway_15hu1pt" />
  </process>
  <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Collaboration_0c2fddn">
      <bpmndi:BPMNShape id="Participant_1tq7aqn_di" bpmnElement="Participant_1tq7aqn" isHorizontal="true">
        <omgdc:Bounds x="152" y="60" width="600" height="250" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_1y45yut_di" bpmnElement="StartEvent_1y45yut">
        <omgdc:Bounds x="202" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="184" y="145" width="73" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_15hu1pt_di" bpmnElement="ExclusiveGateway_15hu1pt" isMarkerVisible="true">
        <omgdc:Bounds x="445" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="438" y="152" width="66" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1bvf838_di" bpmnElement="Task_1hcentk">
        <omgdc:Bounds x="290" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0h21x7r_di" bpmnElement="SequenceFlow_0h21x7r">
        <omgdi:waypoint x="238" y="120" />
        <omgdi:waypoint x="290" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0wnb4ke_di" bpmnElement="SequenceFlow_0wnb4ke">
        <omgdi:waypoint x="390" y="120" />
        <omgdi:waypoint x="445" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
  <bpmndi:BPMNDiagram id="BPMNDiagram_10nurb2">
    <bpmndi:BPMNPlane id="BPMNPlane_1qojmm0" bpmnElement="Task_1hcentk">
      <bpmndi:BPMNShape id="Activity_06lj5c2_di" bpmnElement="Activity_06lj5c2">
        <omgdc:Bounds x="430" y="140" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1dqefh8_di" bpmnElement="Event_1dqefh8">
        <omgdc:Bounds x="292" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_13deigc_di" bpmnElement="Gateway_13deigc" isMarkerVisible="true">
        <omgdc:Bounds x="665" y="145" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0w97r1l_di" bpmnElement="Activity_0w97r1l">
        <omgdc:Bounds x="860" y="140" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_07acibb_di" bpmnElement="Event_07acibb">
        <omgdc:Bounds x="1132" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1lvnlkn_di" bpmnElement="Flow_1lvnlkn">
        <omgdi:waypoint x="430" y="180" />
        <omgdi:waypoint x="328" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1lgtead_di" bpmnElement="Flow_1lgtead">
        <omgdi:waypoint x="530" y="180" />
        <omgdi:waypoint x="598" y="180" />
        <omgdi:waypoint x="598" y="170" />
        <omgdi:waypoint x="665" y="170" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0t5frj2_di" bpmnElement="Flow_0t5frj2">
        <omgdi:waypoint x="715" y="170" />
        <omgdi:waypoint x="788" y="170" />
        <omgdi:waypoint x="788" y="180" />
        <omgdi:waypoint x="860" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1hbfacp_di" bpmnElement="Flow_1hbfacp">
        <omgdi:waypoint x="960" y="180" />
        <omgdi:waypoint x="1132" y="180" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.bpmnJS = new Modeler({
      container: '#diagramRef',
      // propertiesPanel: {
      //   parent: '#propertiesRef'
      // },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        // customPropertiesProvider
        CamundaPlatformPropertiesProviderModule,
        // camundaCloudBehaviors
      ],
      moddleExtensions: {
        custom: custom,
        camunda: camundaModdleDescriptors
      }, keyboard: {
        bindTo: window
      }
    });


    // this.bpmnJS = new Modeler({
    //   container: '#diagramRef', keyboard: {
    //     bindTo: window
    //   }
    // });
    const propertiesPanel = new PropertiesPanel({
      parent: '#js-properties-panel',
    });
    this.bpmnJS.propertiesPanel = propertiesPanel;

    this.pallete_classes = palette_tools_class;
    this.selected_classes = [
      "entry bpmn-icon-subprocess-expanded",
      "entry bpmn-icon-data-object",
      "entry bpmn-icon-data-store",
      "entry bpmn-icon-participant",
      "entry bpmn-icon-group"
    ];
    // let propertiesPanel: any;
    // this.bpmnJS.attachTo(document.getElementById('diagramRef') as HTMLElement);
    // propertiesPanel = this.bpmnJS.get('propertiesPanel');
    // propertiesPanel.attachTo(this.propertiesRef!.nativeElement);
    // this.importDiagram(this.xml);

  }

  ngAfterContentInit(): void {
    this.bpmnJS.attachTo(document.getElementById('diagramRef') as HTMLElement);
    // const propertiesPanel = this.bpmnJS.get('propertiesPanel');
    // propertiesPanel.attachTo(this.propertiesRef!.nativeElement);
    this.importDiagram(this.xml);

    // let bpmnElement = document.getElementById('diagramRef') as HTMLElement;
    // this.bpmnJS.attachTo(bpmnElement);
    // let propertiesPanel: any;
    // propertiesPanel = this.bpmnJS.get('propertiesPanel');
    // let propertyPanel = document.getElementById('propertiesRef') as HTMLElement;
    // propertiesPanel.attachTo(propertyPanel);
    // this.importDiagram(this.xml);


    // let propertiesPanel: any;
    // this.bpmnJS.attachTo(document.getElementById('diagramRef') as HTMLElement);
    // propertiesPanel = this.bpmnJS.get('propertiesPanel');
    // propertiesPanel.attachTo(this.propertiesRef!.nativeElement);
    // this.importDiagram(this.xml);
  }


  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  private importDiagram(xml: string): Observable<{ warnings: Array<any> }> {
    return from(this.bpmnJS.importXML(xml) as Promise<{ warnings: Array<any> }>);
  }
}
