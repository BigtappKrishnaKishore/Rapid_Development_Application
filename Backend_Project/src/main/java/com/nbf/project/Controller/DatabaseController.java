package com.nbf.project.Controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nbf.project.Model.TableMetadata;
import com.nbf.project.Service.DatabaseService;
import com.nbf.project.request.CreateTableRequest;
import com.nbf.project.request.UpdateColumnRequest;

@RestController
public class DatabaseController {
	private static final Logger LOG = LoggerFactory.getLogger(DatabaseController.class);

	@Autowired
	private DatabaseService databaseService;

	@PostMapping("/createtable")
	public String createTable(@RequestBody CreateTableRequest request) {
		LOG.info("Received request to create table: {}", request.getTableMetadata().getTableName());
		try {
			databaseService.createTable(request.getTableMetadata());
			LOG.info("Table '{}' created successfully.", request.getTableMetadata().getTableName());
			return "Table created successfully";
		} catch (Exception e) {
			LOG.error("Failed to create table '{}': {}", request.getTableMetadata().getTableName(), e.getMessage());
			return "Failed to create table: " + e.getMessage();
		}
	}

	
	  @PostMapping("/addColumns")
	    public ResponseEntity<String> addColumns(@RequestBody TableMetadata tableMetadata) {
	        try {
	            databaseService.addColumnsToTable(tableMetadata);
	            return ResponseEntity.ok("Columns added successfully to the table: " + tableMetadata.getTableName());
	        } catch (RuntimeException e) {
	            return ResponseEntity.badRequest().body("Failed to add columns: " + e.getMessage());
	        }
	    }
	  
	  
	  // delete Column 
	  
	  @PostMapping("deleteColumn/{tableName}/{columnName}")
	    public ResponseEntity<String> deleteColumn(@PathVariable String tableName, @PathVariable String columnName) {
	        try {
	        	databaseService.deleteColumn(tableName, columnName);
	            return ResponseEntity.ok("Column '" + columnName + "' successfully deleted from '" + tableName + "'.");
	        } catch (RuntimeException e) {
	            return ResponseEntity.badRequest().body("Error deleting column: " + e.getMessage());
	        }
	    }
	  
	  
	  //Update Coloumn 
	  
	  @PostMapping("/updateColumn")
	  public ResponseEntity<String> updateColumn(@RequestBody UpdateColumnRequest updateColumnRequest) {
	      try {
	          databaseService.updateColumn(updateColumnRequest.getTableName(), updateColumnRequest.getColumnInfo());
	          return ResponseEntity.ok("Column updated successfully.");
	      } catch (RuntimeException e) {
	          return ResponseEntity.badRequest().body("Failed to update column: " + e.getMessage());
	      }
	  }

	  
	  @GetMapping("/getDataTypes")
	  public ResponseEntity<List<String>> getDataTypes() {
	      try {
	          List<String> dataTypes = databaseService.getAllDataTypes();
	          return ResponseEntity.ok(dataTypes);
	      } catch (RuntimeException e) {
	          return ResponseEntity.badRequest().body(Collections.emptyList());
	      }
	  }

	  
	  
	// In DatabaseController.java

	  @PostMapping("/getData")
	  public ResponseEntity<List<Map<String, Object>>> getData(@RequestBody Map<String, Object> request) {
	      String tableName = (String) request.get("tableName");
	      Map<String, Object> conditions = (Map<String, Object>) request.get("conditions");
	      return ResponseEntity.ok(databaseService.getData(tableName, conditions));
	  }

	  @PostMapping("/addData")
	  public ResponseEntity<String> addData(@RequestBody Map<String, Object> request) {
	      String tableName = (String) request.get("tableName");
	      Map<String, Object> data = (Map<String, Object>) request.get("data");
	      databaseService.addData(tableName, data);
	      return ResponseEntity.ok("Data added successfully.");
	  }

	  @PostMapping("/updateData")
	  public ResponseEntity<String> updateData(@RequestBody Map<String, Object> request) {
	      String tableName = (String) request.get("tableName");
	      Map<String, Object> data = (Map<String, Object>) request.get("data");
	      Map<String, Object> conditions = (Map<String, Object>) request.get("conditions");
	      databaseService.updateData(tableName, data, conditions);
	      return ResponseEntity.ok("Data updated successfully.");
	  }

	  @PostMapping("/deleteData")
	  public ResponseEntity<String> deleteData(@RequestBody Map<String, Object> request) {
	      String tableName = (String) request.get("tableName");
	      Map<String, Object> conditions = (Map<String, Object>) request.get("conditions");
	      databaseService.deleteData(tableName, conditions);
	      return ResponseEntity.ok("Data deleted successfully.");
	  }

}